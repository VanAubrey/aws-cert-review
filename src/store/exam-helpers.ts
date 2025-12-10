import { useMemo } from 'react';
import { useExamStore } from './useExamStore';

export function useIsExamActive(): boolean {
    return useExamStore((state) => state.session !== null);
}

export function useExamMetadata() {
    const session = useExamStore((state) => state.session);
    
    return useMemo(() => {
        if (!session) return null;

        return {
            examId: session.examId,
            examCode: session.examCode,
            examTitle: session.examTitle,
            duration: session.duration,
            passingScore: session.passingScore,
            mode: session.mode,
            startTime: session.startTime,
        };
    }, [
        session?.examId,
        session?.examCode,
        session?.examTitle,
        session?.duration,
        session?.passingScore,
        session?.mode,
        session?.startTime
    ]);
}

export function useExamProgress() {
    const session = useExamStore((state) => state.session);
    
    return useMemo(() => {
        if (!session) {
            return { answered: 0, flagged: 0, total: 0 };
        }

        const answered = Object.keys(session.answers).length;
        const flagged = Object.values(session.flags).filter(Boolean).length;
        const total = session.questions.length;

        return { answered, flagged, total };
    }, [
        session?.answers,
        session?.flags,
        session?.questions?.length
    ]);
}

export function useAllQuestions() {
    return useExamStore((state) => state.session?.questions || []);
}

export function useAllAnswers() {
    return useExamStore((state) => state.session?.answers || {});
}

export function useAllFlags() {
    return useExamStore((state) => state.session?.flags || {});
}

export function useCanSubmitExam(): boolean {
    return useExamStore((state) => {
        if (!state.session) return false;

        // At least one question must be answered to submit
        return Object.keys(state.session.answers).length > 0;
    });
}

export function useUnansweredCount(): number {
    return useExamStore((state) => {
        if (!state.session) return 0;

        const totalQuestions = state.session.questions.length;
        const answeredCount = Object.keys(state.session.answers).length;

        return totalQuestions - answeredCount;
    });
}