'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { ExamResults, QuestionResult } from '@/types';

interface QuestionReviewProps {
    results: ExamResults;
}

export function QuestionReview({ results }: QuestionReviewProps) {
    const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

    const toggleQuestion = (questionId: string) => {
        const newExpanded = new Set(expandedQuestions);
        if (newExpanded.has(questionId)) {
            newExpanded.delete(questionId);
        } else {
            newExpanded.add(questionId);
        }
        setExpandedQuestions(newExpanded);
    };

    const expandAll = () => {
        setExpandedQuestions(new Set(results.questionResults.map(q => q.questionId)));
    };

    const collapseAll = () => {
        setExpandedQuestions(new Set());
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Question Review</CardTitle>
                <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={expandAll}>
                    Expand All
                </Button>
                <Button variant="outline" size="sm" onClick={collapseAll}>
                    Collapse All
                </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                {results.questionResults.map((question, index) => (
                    <QuestionReviewItem
                    key={question.questionId}
                    question={question}
                    questionNumber={index + 1}
                    isExpanded={expandedQuestions.has(question.questionId)}
                    onToggle={() => toggleQuestion(question.questionId)}
                    />
                ))}
                </div>
            </CardContent>
        </Card>
    );
}

interface QuestionReviewItemProps {
    question: QuestionResult;
    questionNumber: number;
    isExpanded: boolean;
    onToggle: () => void;
}

function QuestionReviewItem({ 
    question, 
    questionNumber, 
    isExpanded, 
    onToggle 
}: QuestionReviewItemProps) {
    const getStatusIcon = () => {
        if (!question.userAnswerId) {
            return <AlertCircle className="h-5 w-5 text-muted-foreground" />;
        }
        return question.isCorrect ? (
            <CheckCircle className="h-5 w-5 text-success" />
        ) : (
            <XCircle className="h-5 w-5 text-destructive" />
        );
    };

    const getStatusColor = () => {
        if (!question.userAnswerId) return 'border-muted-foreground/20';
        return question.isCorrect ? 'border-success/20 bg-success/5' : 'border-destructive/20 bg-destructive/5';
    };

    return (
        <div className={`border-2 rounded-lg ${getStatusColor()}`}>
            {/* Question Header */}
            <button
                onClick={onToggle}
                className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors rounded-lg"
            >
                <div className="flex items-center gap-3">
                    {getStatusIcon()}
                    <span className="font-medium">Question {questionNumber}</span>
                    {!question.userAnswerId && (
                        <span className="text-xs text-muted-foreground">(Unanswered)</span>
                    )}
                </div>
                {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                )}
            </button>

            {/* Question Details */}
            {isExpanded && (
                <div className="px-4 pb-4 space-y-4">
                    {/* Question Text */}
                    <p className="text-sm md:text-base">{question.questionText}</p>

                    {/* Options */}
                    <div className="space-y-2">
                        {question.options.map((option, index) => {
                            const letter = String.fromCharCode(65 + index);
                            const isCorrect = option.id === question.correctAnswerId;
                            const isUserAnswer = option.id === question.userAnswerId;

                            return (
                                <div
                                    key={option.id}
                                    className={`p-3 rounded-md border-2 ${
                                        isCorrect
                                        ? 'border-success bg-success/10'
                                        : isUserAnswer
                                        ? 'border-destructive bg-destructive/10'
                                        : 'border-border'
                                    }`}
                                >
                                    <div className="flex items-start gap-2">
                                        <span className="font-semibold">{letter}.</span>
                                        <div className="flex-1">
                                            <p className="text-sm">{option.text}</p>
                                            <div className="flex gap-2 mt-1">
                                                {isCorrect && (
                                                    <span className="text-xs text-success font-medium">
                                                        ✓ Correct Answer
                                                    </span>
                                                )}
                                                {isUserAnswer && !isCorrect && (
                                                    <span className="text-xs text-destructive font-medium">
                                                        ✗ Your Answer
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}