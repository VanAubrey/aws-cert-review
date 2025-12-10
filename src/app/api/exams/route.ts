import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { ApiResponse, ExamListResponse } from '@/types/api';

export async function GET() {
    try {
        const exams = await prisma.exam.findMany({
            select: {
                id: true,
                code: true,
                title: true,
                duration: true,
                passingScore: true,
            },
            orderBy: {
                code: 'asc',
            },
        });

        const response: ApiResponse<ExamListResponse> = {
            success: true,
            data: { exams },
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error fetching exams:', error);

        const response: ApiResponse<ExamListResponse> = {
            success: false,
            error: 'Failed to fetch exams',
        };

        return NextResponse.json(response, { status: 500 });
    }
}