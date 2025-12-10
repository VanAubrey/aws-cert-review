'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, BookOpen, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { formatDuration } from '@/lib/exam-utils';
import type { Exam, ExamMode } from '@/types';

interface ExamCardProps {
    exam: Exam;
}

export function ExamCard({ exam }: ExamCardProps) {
    const router = useRouter();
    const [showModeDialog, setShowModeDialog] = useState(false);

    const handleStartExam = (mode: ExamMode) => {
        setShowModeDialog(false);
        router.push(`/exam/${exam.id}?mode=${mode}`);
    };

    return (
        <>
            <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-primary">{exam.code}</span>
                        <Award className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-xl">{exam.title}</CardTitle>
                    <CardDescription>
                        Practice exam for AWS certification
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatDuration(exam.duration)}
                        </span>
                        <span className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            65 questions
                        </span>
                    </div>
                    
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                            Passing Score: {exam.passingScore}/1000
                        </p>
                    </div>

                    <Button 
                        className="w-full" 
                        onClick={() => setShowModeDialog(true)}
                    >
                        Start Practice Exam
                    </Button>
                </CardContent>
            </Card>

            {/* Mode Selection Dialog */}
            <Dialog open={showModeDialog} onOpenChange={setShowModeDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Choose Exam Mode</DialogTitle>
                        <DialogDescription>
                            Select how you'd like to take the {exam.code} practice exam
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3">
                        <button
                            onClick={() => handleStartExam('timed')}
                            className="w-full p-4 border-2 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-left"
                        >
                            <div className="flex items-start gap-3">
                                <Clock className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <h3 className="font-semibold mb-1">Timed Mode</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Simulate real exam conditions with a {formatDuration(exam.duration)} time limit
                                    </p>
                                </div>
                            </div>
                        </button>

                        <button
                            onClick={() => handleStartExam('untimed')}
                            className="w-full p-4 border-2 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-left"
                        >
                            <div className="flex items-start gap-3">
                                <BookOpen className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <h3 className="font-semibold mb-1">Practice Mode</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Learn as you go with immediate feedback and no time pressure
                                    </p>
                                </div>
                            </div>
                        </button>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowModeDialog(false)}>
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}