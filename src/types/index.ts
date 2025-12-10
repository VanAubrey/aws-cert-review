export interface Exam {
    id: string;
    code: string; // "CLF-C02", "SAA-C03"
    title: string; // "AWS Certified Cloud Practitioner"
    duration: number; // Minutes (e.g., 90)
    passingScore: number; // e.g., 700
    questions?: Question[];
    attempts?: Attempt[];
}

export interface Question {
    id: string;
    text: string;
    examId: string;
    exam?: Exam;
    options: Option[];
}

export interface Option {
    id: string;
    text: string;
    isCorrect: boolean;
    questionId: string;
    question?: Question;
}

export interface Attempt {
    id: string;
    examId: string;
    exam?: Exam;
    startedAt: Date;
    completedAt: Date | null;
    score: number | null; // 0 - 1000
    isPassed: boolean | null;
    answers: Record<string, string> | null; // { "questionId": "optionId" }
}

// ============================================================================
// Exam Session Types (for active exam state)
// ============================================================================

// Question with populated options for exam session
export interface ExamQuestion {
    id: string;
    text: string;
    options: ExamOption[];
}

// Option for exam session
export interface ExamOption {
    id: string;
    text: string;
    isCorrect: boolean;
}

// Active exam session state
export interface ExamSession {
    examId: string;
    examCode: string;
    examTitle: string;
    duration: number;
    passingScore: number;
    questions: ExamQuestion[];
    currentIndex: number;
    answers: Record<string, string>; // { "questionId": "optionId" }
    flags: Record<string, boolean>; // { "questionId": true/false }
    mode: ExamMode;
    startTime: Date;
    timeRemaining: number | null; // seconds remaining (null for untimed)
}

export type ExamMode = 'timed' | 'untimed';

// ============================================================================
// Exam Results Types
// ============================================================================

// Result for a single question after exam completion
export interface QuestionResult {
    questionId: string;
    questionText: string;
    options: ExamOption[];
    userAnswerId: string | null;
    correctAnswerId: string;
    isCorrect: boolean;
}

// Complete exam results
export interface ExamResults {
    attemptId: string;
    examId: string;
    examCode: string;
    examTitle: string;
    score: number; // 0 - 1000
    isPassed: boolean;
    passingScore: number;
    totalQuestions: number;
    correctAnswers: number;
    incorrectAnswers: number;
    unanswered: number;
    completedAt: Date;
    duration: number; // minutes
    questionResults: QuestionResult[];
}

// ============================================================================
// Utility Types
// ============================================================================

// Question status for UI rendering
export type QuestionStatus = 'answered' | 'flagged' | 'unanswered' | 'current';

// Exam statistics for dashboard
export interface ExamStats {
    examId: string;
    totalAttempts: number;
    bestScore: number | null;
    averageScore: number | null;
    lastAttemptDate: Date | null;
    passRate: number; // percentage
}