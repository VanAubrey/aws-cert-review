'use client';

import { Flag, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
    useCurrentQuestion,
    useCurrentAnswer,
    useIsCurrentFlagged,
} from '@/store/useExamStore';
import { useExamStore } from '@/store/useExamStore';

export function QuestionCard() {
    const currentQuestion = useCurrentQuestion();
    const currentAnswer = useCurrentAnswer();
    const isFlagged = useIsCurrentFlagged();
    const { session, answerQuestion, toggleFlag } = useExamStore();

    if (!currentQuestion || !session) return null;

    const questionNumber = session.currentIndex + 1;
    const isUntimed = session.mode === 'untimed';

    const handleAnswerSelect = (optionId: string) => {
        answerQuestion(currentQuestion.id, optionId);
    };

    const handleToggleFlag = () => {
        toggleFlag(currentQuestion.id);
    };

    return (
        <Card className="p-6">
            {/* Question Header */}
            <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-muted-foreground">
                            Question {questionNumber} of {session.questions.length}
                        </span>
                        {currentAnswer && (
                            <CheckCircle className="h-4 w-4 text-success" />
                        )}
                    </div>
                    <h2 className="text-lg md:text-xl font-medium text-foreground">
                        {currentQuestion.text}
                    </h2>
                </div>

                {/* Flag Button */}
                <Button
                    variant={isFlagged ? 'default' : 'outline'}
                    size="icon"
                    onClick={handleToggleFlag}
                    className={isFlagged ? 'bg-primary' : ''}
                >
                    <Flag className={`h-4 w-4 ${isFlagged ? 'fill-current' : ''}`} />
                </Button>
            </div>

            {/* Answer Options */}
            <RadioGroup value={currentAnswer || ''} onValueChange={handleAnswerSelect}>
                <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => {
                        const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
                        const isSelected = currentAnswer === option.id;
                        const showCorrect = isUntimed && isSelected;
                        const isCorrect = option.isCorrect;

                        return (
                            <div
                                key={option.id}
                                className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                                isSelected
                                    ? showCorrect && isCorrect
                                    ? 'border-success bg-success/5'
                                    : showCorrect && !isCorrect
                                    ? 'border-destructive bg-destructive/5'
                                    : 'border-primary bg-primary/5'
                                    : 'border-border hover:border-muted-foreground'
                                }`}
                            >
                                <RadioGroupItem
                                    value={option.id}
                                    id={option.id}
                                    className="mt-0.5"
                                />
                                <Label
                                    htmlFor={option.id}
                                    className="flex-1 cursor-pointer text-sm md:text-base"
                                >
                                    <span className="font-semibold mr-2">{optionLetter}.</span>
                                    {option.text}
                                </Label>
                                {showCorrect && (
                                    <div className="shrink-0">
                                        {isCorrect ? (
                                            <CheckCircle className="h-5 w-5 text-success" />
                                        ) : (
                                            <span className="text-destructive text-sm font-medium">
                                                Incorrect
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </RadioGroup>

            {/* Untimed Mode Feedback */}
            {isUntimed && currentAnswer && (
                <div className="mt-6 p-4 rounded-lg bg-muted">
                    <p className="text-sm text-muted-foreground">
                        {currentQuestion.options.find((o) => o.id === currentAnswer)
                        ?.isCorrect
                        ? '✓ Correct! You can proceed to the next question.'
                        : '✗ Incorrect. Review the correct answer above.'}
                    </p>
                </div>
            )}
        </Card>
    );
}