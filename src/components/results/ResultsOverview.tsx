'use client';

import { Award, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { calculatePercentage, formatDuration } from '@/lib/exam-utils';
import type { ExamResults } from '@/types';

interface ResultsOverviewProps {
    results: ExamResults;
}

export function ResultsOverview({ results }: ResultsOverviewProps) {
    const percentage = calculatePercentage(results.score);
    const passingPercentage = calculatePercentage(results.passingScore);

    return (
        <div className="space-y-6 mb-8">
            {/* Pass/Fail Banner */}
            <Card className={results.isPassed ? 'border-success bg-success/5' : 'border-destructive bg-destructive/5'}>
                <CardContent className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${results.isPassed ? 'bg-success/10' : 'bg-destructive/10'}`}>
                            {results.isPassed ? (
                                <Award className="h-8 w-8 text-success" />
                            ) : (
                                <XCircle className="h-8 w-8 text-destructive" />
                            )}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">
                                {results.isPassed ? 'Congratulations! You Passed!' : 'Not Passed'}
                            </h2>
                            <p className="text-muted-foreground">
                                You scored {results.score} out of 1000 ({percentage}%)
                            </p>
                        </div>
                    </div>
                    <div className="hidden md:block text-right">
                        <p className="text-sm text-muted-foreground">Passing Score</p>
                        <p className="text-lg font-semibold">{results.passingScore} ({passingPercentage}%)</p>
                    </div>
                </CardContent>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Correct Answers</CardTitle>
                        <CheckCircle className="h-4 w-4 text-success" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-success">
                            {results.correctAnswers}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {Math.round((results.correctAnswers / results.totalQuestions) * 100)}% of total
                        </p>
                        <Progress 
                            value={(results.correctAnswers / results.totalQuestions) * 100} 
                            className="mt-2 h-2"
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Incorrect Answers</CardTitle>
                        <XCircle className="h-4 w-4 text-destructive" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-destructive">
                            {results.incorrectAnswers}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {Math.round((results.incorrectAnswers / results.totalQuestions) * 100)}% of total
                        </p>
                        <Progress 
                            value={(results.incorrectAnswers / results.totalQuestions) * 100} 
                            className="mt-2 h-2"
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Unanswered</CardTitle>
                        <AlertCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-muted-foreground">
                            {results.unanswered}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {Math.round((results.unanswered / results.totalQuestions) * 100)}% of total
                        </p>
                        <Progress 
                            value={(results.unanswered / results.totalQuestions) * 100} 
                            className="mt-2 h-2"
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Exam Details */}
            <Card>
                <CardHeader>
                    <CardTitle>Exam Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Total Questions</p>
                            <p className="text-lg font-semibold">{results.totalQuestions}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Duration</p>
                            <p className="text-lg font-semibold">{formatDuration(results.duration)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Completed At</p>
                            <p className="text-lg font-semibold">
                                {new Date(results.completedAt).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Time</p>
                            <p className="text-lg font-semibold">
                                {new Date(results.completedAt).toLocaleTimeString()}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}