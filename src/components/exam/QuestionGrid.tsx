'use client';

import { Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAllQuestions, useAllAnswers, useAllFlags } from '@/store/exam-helpers';
import { useExamStore } from '@/store/useExamStore';
import { getQuestionStatus } from '@/lib/exam-utils';

export function QuestionGrid() {
    const questions = useAllQuestions();
    const answers = useAllAnswers();
    const flags = useAllFlags();
    const { session, goToQuestion } = useExamStore();

    if (!session) return null;

    const currentQuestionId = questions[session.currentIndex]?.id;

    return (
        <div className="grid grid-cols-5 gap-2">
            {questions.map((question, index) => {
                const status = getQuestionStatus(
                    question.id,
                    currentQuestionId,
                    answers,
                    flags
                );

                const isCurrent = status === 'current';
                const isAnswered = status === 'answered';
                const isFlagged = status === 'flagged';

                return (
                    <Button
                        key={question.id}
                        variant={isCurrent ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => goToQuestion(index)}
                        className={`relative h-10 ${
                        isAnswered && !isCurrent
                            ? 'border-success bg-success/10'
                            : ''
                        }`}
                    >
                        <span>{index + 1}</span>
                        {isFlagged && (
                            <Flag className="absolute -top-1 -right-1 h-3 w-3 fill-primary text-primary" />
                        )}
                    </Button>
                );
            })}
        </div>
    );
}