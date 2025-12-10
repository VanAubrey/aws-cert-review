'use client';

import { useState, useCallback } from 'react';
import type {
    ApiResponse,
    ExamListResponse,
    StartExamResponse,
    SubmitExamResponse,
    ExamResultsResponse,
} from '@/types/api';
import type { ExamMode } from '@/types';

interface UseApiClientReturn {
    loading: boolean;
    error: string | null;
    getExams: () => Promise<ExamListResponse | null>;
    startExam: (examId: string, mode: ExamMode, questionCount?: number) => Promise<StartExamResponse | null>;
    submitExam: (examId: string, answers: Record<string, string>, startTime: Date) => Promise<SubmitExamResponse | null>;
    getResults: (attemptId: string) => Promise<ExamResultsResponse | null>;
    clearError: () => void;
}

export function useApiClient(): UseApiClientReturn {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Generic request handler to avoid repetition
    const handleRequest = useCallback(async <T,>(
        url: string,
        options?: RequestInit
    ): Promise<T | null> => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options?.headers,
                },
                ...options,
            });

            const data: ApiResponse<T> = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'An error occurred');
            }

            return data.data || null;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
            setError(errorMessage);
            console.error('API Error:', errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // API methods using the generic handler
    const getExams = useCallback(async (): Promise<ExamListResponse | null> => {
        return handleRequest<ExamListResponse>('/api/exams');
    }, [handleRequest]);

    const startExam = useCallback(async (
        examId: string,
        mode: ExamMode,
        questionCount = 65
    ): Promise<StartExamResponse | null> => {
        return handleRequest<StartExamResponse>(`/api/exams/${examId}/start`, {
            method: 'POST',
            body: JSON.stringify({ mode, questionCount }),
        });
    }, [handleRequest]);

    const submitExam = useCallback(async (
        examId: string,
        answers: Record<string, string>,
        startTime: Date
    ): Promise<SubmitExamResponse | null> => {
        return handleRequest<SubmitExamResponse>(`/api/exams/${examId}/submit`, {
            method: 'POST',
            body: JSON.stringify({
                answers,
                startTime: startTime.toISOString()
            }),
        });
    }, [handleRequest]);

    const getResults = useCallback(async (
        attemptId: string
    ): Promise<ExamResultsResponse | null> => {
        return handleRequest<ExamResultsResponse>(`/api/results/${attemptId}`);
    }, [handleRequest]);

    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        loading,
        error,
        getExams,
        startExam,
        submitExam,
        getResults,
        clearError,
    };
}