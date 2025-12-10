import type { Exam, ExamSession, ExamResults } from './index';

// Standard API response wrapper
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

// Exam list response
export interface ExamListResponse {
    exams: Exam[];
}

// Start exam response
export interface StartExamResponse {
    session: ExamSession;
}

// Submit exam response
export interface SubmitExamResponse {
    attemptId: string;
    score: number;
    isPassed: boolean;
}

// Get exam results response
export interface ExamResultsResponse {
    results: ExamResults;
}

// Error response structure
export interface ErrorResponse {
    error: string;
    message: string;
    statusCode: number;
}