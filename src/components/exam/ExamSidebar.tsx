'use client';

import { QuestionGrid } from './QuestionGrid';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { SubmitExamDialog } from './SubmitExamDialog';

export function ExamSidebar() {
    const [showSubmitDialog, setShowSubmitDialog] = useState(false);

    return (
        <>
            <aside className="hidden lg:block w-80 border-l bg-card overflow-y-auto">
                <div className="p-6">
                    <h3 className="font-semibold mb-4">Questions</h3>
                    <QuestionGrid />

                    <Button
                        className="w-full mt-6"
                        variant="default"
                        onClick={() => setShowSubmitDialog(true)}
                    >
                        Submit Exam
                    </Button>
                </div>
            </aside>

            <SubmitExamDialog
                open={showSubmitDialog}
                onOpenChange={setShowSubmitDialog}
            />
        </>
    );
}