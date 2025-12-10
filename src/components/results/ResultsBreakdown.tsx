'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ExamResults } from '@/types';

interface ResultsBreakdownProps {
    results: ExamResults;
}

export function ResultsBreakdown({ results }: ResultsBreakdownProps) {
    const accuracy = Math.round((results.correctAnswers / results.totalQuestions) * 100);

    return (
        <Card className="mb-8">
            <CardHeader>
                <CardTitle>Performance Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Score Bar */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Overall Score</span>
                            <span className="text-sm text-muted-foreground">
                                {results.score} / 1000
                            </span>
                        </div>
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                            <div
                                className={`h-full ${results.isPassed ? 'bg-success' : 'bg-destructive'}`}
                                style={{ width: `${(results.score / 1000) * 100}%` }}
                            />
                        </div>
                    </div>

                    {/* Accuracy Bar */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Accuracy Rate</span>
                            <span className="text-sm text-muted-foreground">{accuracy}%</span>
                        </div>
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary"
                                style={{ width: `${accuracy}%` }}
                            />
                        </div>
                    </div>

                    {/* Completion Rate */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Completion Rate</span>
                            <span className="text-sm text-muted-foreground">
                                {Math.round(((results.totalQuestions - results.unanswered) / results.totalQuestions) * 100)}%
                            </span>
                        </div>
                        <div className="h-3 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-accent"
                                style={{ 
                                width: `${((results.totalQuestions - results.unanswered) / results.totalQuestions) * 100}%` 
                                }}
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}