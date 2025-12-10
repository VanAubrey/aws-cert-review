import type { QuestionStatus } from '@/types';

// Determine question status based on current state
export function getQuestionStatus(
    questionId: string,
    currentQuestionId: string,
    answers: Record<string, string>,
    flags: Record<string, boolean>
): QuestionStatus {
    if (questionId === currentQuestionId) {
        return 'current';
    }
    if (flags[questionId]) {
        return 'flagged';
    }
    if (answers[questionId]) {
        return 'answered';
    }
    return 'unanswered';
}

// Calculate exam score (0-1000 scale)
export function calculateScore(correct: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((correct / total) * 1000);
}

// Check if score passes the exam
export function isPassing(score: number, passingScore: number): boolean {
    return score >= passingScore;
}

// Calculate percentage score
export function calculatePercentage(score: number): number {
    return Math.round((score / 1000) * 100);
}

// Format time remaining (in seconds) to MM:SS
export function formatTimeRemaining(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Format duration (in minutes) to human readable string
export function formatDuration(minutes: number): string {
    if (minutes < 60) {
        return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0
        ? `${hours}h ${mins}m`
        : `${hours} hour${hours > 1 ? 's' : ''}`;
}

// Calculate time elapsed (in seconds)
export function calculateTimeElapsed(startTime: Date): number {
    return Math.floor((Date.now() - startTime.getTime()) / 1000);
}

// Get count of answered questions
export function getAnsweredCount(answers: Record<string, string>): number {
    return Object.keys(answers).length;
}

// Get count of flagged questions
export function getFlaggedCount(flags: Record<string, boolean>): number {
    return Object.values(flags).filter(Boolean).length;
}

// Shuffle array (Fisher-Yates algorithm)
export function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Get progress percentage
export function getProgressPercentage(
    currentIndex: number,
    totalQuestions: number
): number {
    if (totalQuestions === 0) return 0;
    return Math.round(((currentIndex + 1) / totalQuestions) * 100);
}

// Validate exam code format (e.g., CLF-C02, SAA-C03)
export function isValidExamCode(code: string): boolean {
    return /^[A-Z]{3}-[A-Z]\d{2}$/.test(code);
}