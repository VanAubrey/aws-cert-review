import { useExamStore } from './useExamStore';

export function useIsExamActive(): boolean {
    return useExamStore((state) => state.session !== null);
}

export function useExamMetadata() {
    return useExamStore((state) => {
        if (!state.session) return null;

        return {
            examId: state.session.examId,
            examCode: state.session.examCode,
            examTitle: state.session.examTitle,
            duration: state.session.duration,
            passingScore: state.session.passingScore,
            mode: state.session.mode,
            startTime: state.session.startTime,
        };
    });
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