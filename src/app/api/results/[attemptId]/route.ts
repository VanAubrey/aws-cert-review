import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { parseAnswers } from '@/lib/type-guards';
import type { ApiResponse, ExamResultsResponse } from '@/types/api';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ attemptId: string }> }
) {
    try {
        const { attemptId } = await params;

        const attempt = await prisma.attempt.findUnique({
            where: { id: attemptId },
            include: {
                exam: {
                    include: {
                        questions: {
                            include: {
                                options: {
                                    select: {
                                        id: true,
                                        text: true,
                                        isCorrect: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!attempt) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Attempt not found',
                } as ApiResponse<ExamResultsResponse>,
                { status: 404 }
            );
        }

        const userAnswers = parseAnswers(attempt.answers);

        // Build question results
        const questionResults = attempt.exam.questions.map(question => {
            const userAnswerId = userAnswers[question.id] || null;
            const correctOption = question.options.find(opt => opt.isCorrect);
            const correctAnswerId = correctOption?.id || '';

            return {
                questionId: question.id,
                questionText: question.text,
                options: question.options,
                userAnswerId,
                correctAnswerId,
                isCorrect: userAnswerId === correctAnswerId,
            };
        });

        // Calculate statistics
        const correctAnswers = questionResults.filter(r => r.isCorrect).length;
        const incorrectAnswers = questionResults.filter(r => !r.isCorrect && r.userAnswerId).length;
        const unanswered = questionResults.filter(r => !r.userAnswerId).length;

        const results = {
            attemptId: attempt.id,
            examCode: attempt.exam.code,
            examTitle: attempt.exam.title,
            score: attempt.score || 0,
            isPassed: attempt.isPassed || false,
            passingScore: attempt.exam.passingScore,
            totalQuestions: attempt.exam.questions.length,
            correctAnswers,
            incorrectAnswers,
            unanswered,
            completedAt: attempt.completedAt || new Date(),
            duration: attempt.exam.duration,
            questionResults,
        };

        const response: ApiResponse<ExamResultsResponse> = {
            success: true,
            data: { results },
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error fetching results:', error);

        const response: ApiResponse<ExamResultsResponse> = {
            success: false,
            error: 'Failed to fetch exam results',
        };

        return NextResponse.json(response, { status: 500 });
    }
}