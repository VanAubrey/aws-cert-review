'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useApiClient } from '@/hooks/useApiClient';
import { useExamStore } from '@/store/useExamStore';
import { useUnansweredCount, useExamMetadata } from '@/store/exam-helpers';

interface SubmitExamDialogProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function SubmitExamDialog({ open, onOpenChange }: SubmitExamDialogProps) {
    const router = useRouter();
    const { submitExam, loading } = useApiClient();
    const { session, clearSession } = useExamStore();
    const unansweredCount = useUnansweredCount();
    const metadata = useExamMetadata();

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!session || !metadata) return;

        setIsSubmitting(true);

        const response = await submitExam(
            metadata.examId,
            session.answers,
            session.startTime
        );

        if (response) {
            clearSession();
            router.push(`/exam/${metadata.examId}/result/${response.attemptId}`);
        } else {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Submit Exam?</DialogTitle>
                    <DialogDescription>
                        {unansweredCount > 0 ? (
                            <>
                                You have <strong>{unansweredCount} unanswered question{unansweredCount !== 1 ? 's' : ''}</strong>.
                                Are you sure you want to submit?
                            </>
                        ) : (
                            'Are you sure you want to submit your exam? This action cannot be undone.'
                        )}
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange?.(false)}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="default"
                        onClick={handleSubmit}
                        disabled={isSubmitting || loading}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Exam'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}