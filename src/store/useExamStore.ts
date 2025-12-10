import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { ExamSession } from '@/types';

/**
 * Exam store state interface
 */
interface ExamState {
    session: ExamSession | null;
    isLoading: boolean;
    isSubmitting: boolean;
    error: string | null;
}

/**
 * Exam store actions interface
 */
interface ExamActions {
    // Session management
    initializeSession: (session: ExamSession) => void;
    clearSession: () => void;

    // Navigation
    setCurrentIndex: (index: number) => void;
    nextQuestion: () => void;
    previousQuestion: () => void;
    goToQuestion: (index: number) => void;

    // Answer management
    answerQuestion: (questionId: string, optionId: string) => void;
    clearAnswer: (questionId: string) => void;

    // Flag management
    toggleFlag: (questionId: string) => void;
    clearFlag: (questionId: string) => void;

    // Timer management
    updateTimeRemaining: (seconds: number) => void;

    // Loading and error states
    setLoading: (loading: boolean) => void;
    setSubmitting: (submitting: boolean) => void;
    setError: (error: string | null) => void;

    // Utilities
    getProgress: () => { answered: number; flagged: number; total: number };
    isQuestionAnswered: (questionId: string) => boolean;
    isQuestionFlagged: (questionId: string) => boolean;
}

/**
 * Combined store type
 */
type ExamStore = ExamState & ExamActions;

/**
 * Initial state
 */
const initialState: ExamState = {
    session: null,
    isLoading: false,
    isSubmitting: false,
    error: null,
};

/**
 * Exam store with persistence and devtools
 */
export const useExamStore = create<ExamStore>()(
    devtools(
        persist(
            (set, get) => ({
                ...initialState,

                // Session management
                initializeSession: (session) => {
                    set(
                        {
                            session,
                            error: null,
                        },
                        false,
                        'initializeSession'
                    );
                },

                clearSession: () => {
                    set(
                        initialState,
                        false,
                        'clearSession'
                    );
                },

                // Navigation
                setCurrentIndex: (index) => {
                    const { session } = get();
                    if (!session) return;

                    if (index < 0 || index >= session.questions.length) {
                        console.warn('Invalid question index:', index);
                        return;
                    }

                    set(
                        {
                            session: {
                                ...session,
                                currentIndex: index,
                            },
                        },
                        false,
                        'setCurrentIndex'
                    );
                },

                nextQuestion: () => {
                    const { session } = get();
                    if (!session) return;

                    const nextIndex = session.currentIndex + 1;
                    if (nextIndex < session.questions.length) {
                        get().setCurrentIndex(nextIndex);
                    }
                },

                previousQuestion: () => {
                    const { session } = get();
                    if (!session) return;

                    const prevIndex = session.currentIndex - 1;
                    if (prevIndex >= 0) {
                        get().setCurrentIndex(prevIndex);
                    }
                },

                goToQuestion: (index) => {
                    get().setCurrentIndex(index);
                },

                // Answer management
                answerQuestion: (questionId, optionId) => {
                    const { session } = get();
                    if (!session) return;

                    set(
                        {
                            session: {
                                ...session,
                                answers: {
                                    ...session.answers,
                                    [questionId]: optionId,
                                },
                            },
                        },
                        false,
                        'answerQuestion'
                    );
                },

                clearAnswer: (questionId) => {
                    const { session } = get();
                    if (!session) return;

                    const { [questionId]: _, ...remainingAnswers } = session.answers;

                    set(
                        {
                            session: {
                                ...session,
                                answers: remainingAnswers,
                            },
                        },
                        false,
                        'clearAnswer'
                    );
                },

                // Flag management
                toggleFlag: (questionId) => {
                    const { session } = get();
                    if (!session) return;

                    const currentFlag = session.flags[questionId] || false;

                    set(
                        {
                            session: {
                                ...session,
                                flags: {
                                    ...session.flags,
                                    [questionId]: !currentFlag,
                                },
                            },
                        },
                        false,
                        'toggleFlag'
                    );
                },

                clearFlag: (questionId) => {
                    const { session } = get();
                    if (!session) return;

                    const { [questionId]: _, ...remainingFlags } = session.flags;

                    set(
                        {
                            session: {
                                ...session,
                                flags: remainingFlags,
                            },
                        },
                        false,
                        'clearFlag'
                    );
                },

                // Timer management
                updateTimeRemaining: (seconds) => {
                    const { session } = get();
                    if (!session) return;

                    set(
                        {
                            session: {
                                ...session,
                                timeRemaining: seconds,
                            },
                        },
                        false,
                        'updateTimeRemaining'
                    );
                },

                // Loading and error states
                setLoading: (loading) => {
                    set({ isLoading: loading }, false, 'setLoading');
                },

                setSubmitting: (submitting) => {
                    set({ isSubmitting: submitting }, false, 'setSubmitting');
                },

                setError: (error) => {
                    set({ error }, false, 'setError');
                },

                // Utilities
                getProgress: () => {
                    const { session } = get();
                    if (!session) {
                        return { answered: 0, flagged: 0, total: 0 };
                    }

                    const answered = Object.keys(session.answers).length;
                    const flagged = Object.values(session.flags).filter(Boolean).length;
                    const total = session.questions.length;

                    return { answered, flagged, total };
                },

                isQuestionAnswered: (questionId) => {
                    const { session } = get();
                    return !!session?.answers[questionId];
                },

                isQuestionFlagged: (questionId) => {
                    const { session } = get();
                    return !!session?.flags[questionId];
                },
            }),
            {
                name: 'exam-storage',
                partialize: (state) => ({
                    session: state.session,
                }),
            }
        ),
        {
            name: 'ExamStore',
            enabled: process.env.NODE_ENV === 'development',
        }
    )
);

/**
 * Selectors for optimized re-renders
 */
export const useCurrentQuestion = () =>
    useExamStore((state) => {
        if (!state.session) return null;
        return state.session.questions[state.session.currentIndex];
    });

export const useCurrentAnswer = () =>
    useExamStore((state) => {
        if (!state.session) return null;
        const currentQuestion = state.session.questions[state.session.currentIndex];
        return state.session.answers[currentQuestion.id] || null;
    });

export const useIsCurrentFlagged = () =>
    useExamStore((state) => {
        if (!state.session) return false;
        const currentQuestion = state.session.questions[state.session.currentIndex];
        return !!state.session.flags[currentQuestion.id];
    });

export const useExamProgress = () =>
    useExamStore((state) => state.getProgress());

export const useTimeRemaining = () =>
    useExamStore((state) => state.session?.timeRemaining || null);

export const useExamMode = () =>
    useExamStore((state) => state.session?.mode || null);

export const useCanNavigate = () =>
    useExamStore((state) => {
        if (!state.session) return { canNext: false, canPrev: false };

        return {
            canNext: state.session.currentIndex < state.session.questions.length - 1,
            canPrev: state.session.currentIndex > 0,
        };
    });