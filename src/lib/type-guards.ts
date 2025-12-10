import type { ExamMode, QuestionStatus } from '@/types';

// Check if exam mode is valid
export function isValidExamMode(mode: unknown): mode is ExamMode {
    return mode === 'timed' || mode === 'untimed';
}

// Check if a value is a valid question status
export function isValidQuestionStatus(status: unknown): status is QuestionStatus {
    return (
        status === 'answered' ||
        status === 'flagged' ||
        status === 'unanswered' ||
        status === 'current'
    );
}

// Check if value is a valid answers object
export function isValidAnswersObject(value: unknown): value is Record<string, string> {
    if (!value || typeof value !== 'object') return false;

    return Object.entries(value).every(
        ([key, val]) => typeof key === 'string' && typeof val === 'string'
    );
}

// Check if value is a valid flags object
export function isValidFlagsObject(value: unknown): value is Record<string, boolean> {
    if (!value || typeof value !== 'object') return false;

    return Object.entries(value).every(
        ([key, val]) => typeof key === 'string' && typeof val === 'boolean'
    );
}

// Safe JSON parse for answers object
export function parseAnswers(json: unknown): Record<string, string> {
    if (!json) return {};
    if (isValidAnswersObject(json)) return json;

    try {
        const parsed = JSON.parse(String(json));
        return isValidAnswersObject(parsed) ? parsed : {};
    } catch {
        return {};
    }
}