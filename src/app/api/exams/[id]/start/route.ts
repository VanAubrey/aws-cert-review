import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { shuffleArray } from '@/lib/exam-utils';
import { isValidExamMode } from '@/lib/type-guards';
import type { ApiResponse, StartExamResponse } from '@/types/api';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { mode, questionCount = 65 } = body;

        if (!isValidExamMode(mode)) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid exam mode. Must be "timed" or "untimed"',
                } as ApiResponse<StartExamResponse>,
                { status: 400 }
            );
        }

        // Fetch exam with questions and options
        const exam = await prisma.exam.findUnique({
            where: { id },
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
        });

        if (!exam) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Exam not found',
                } as ApiResponse<StartExamResponse>,
                { status: 404 }
            );
        }

        const shuffledQuestions = shuffleArray(exam.questions)
            .slice(0, questionCount)
            .map(q => ({
                id: q.id,
                text: q.text,
                options: shuffleArray(q.options),
            }));

        // Create exam session
        const session = {
            examId: exam.id,
            examCode: exam.code,
            examTitle: exam.title,
            duration: exam.duration,
            passingScore: exam.passingScore,
            questions: shuffledQuestions,
            currentIndex: 0,
            answers: {},
            flags: {},
            mode,
            startTime: new Date(),
            timeRemaining: mode === 'timed' ? exam.duration * 60 : null,
        };

        const response: ApiResponse<StartExamResponse> = {
            success: true,
            data: { session },
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error starting exam:', error);

        const response: ApiResponse<StartExamResponse> = {
            success: false,
            error: 'Failed to start exam session',
        };

        return NextResponse.json(response, { status: 500 });
    }
}