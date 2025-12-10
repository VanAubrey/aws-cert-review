import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateScore, isPassing } from '@/lib/exam-utils';
import { isValidAnswersObject } from '@/lib/type-guards';
import type { ApiResponse, SubmitExamResponse } from '@/types/api';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { answers, startTime } = body;

        if (!isValidAnswersObject(answers)) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid answers format',
                } as ApiResponse<SubmitExamResponse>,
                { status: 400 }
            );
        }

        // Fetch exam with correct answers
        const exam = await prisma.exam.findUnique({
            where: { id },
            include: {
                questions: {
                    include: {
                        options: {
                            where: { isCorrect: true },
                            select: { id: true },
                        },
                    },
                },
            },
        });

        if (!exam) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Exam not found',
                } as ApiResponse<SubmitExamResponse>,
                { status: 404 }
            );
        }

        // Calculate correct answers
        let correctCount = 0;
        exam.questions.forEach(question => {
            const userAnswer = answers[question.id];
            const correctAnswer = question.options[0]?.id;

            if (userAnswer === correctAnswer) {
                correctCount++;
            }
        });

        const score = calculateScore(correctCount, exam.questions.length);
        const passed = isPassing(score, exam.passingScore);

        // Save attempt to database
        const attempt = await prisma.attempt.create({
            data: {
                examId: id,
                startedAt: new Date(startTime),
                completedAt: new Date(),
                score,
                isPassed: passed,
                answers,
            },
        });

        const response: ApiResponse<SubmitExamResponse> = {
            success: true,
            data: {
                attemptId: attempt.id,
                score,
                isPassed: passed,
            },
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error submitting exam:', error);

        const response: ApiResponse<SubmitExamResponse> = {
            success: false,
            error: 'Failed to submit exam',
        };

        return NextResponse.json(response, { status: 500 });
    }
}