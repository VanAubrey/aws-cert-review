'use client';

import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { QuestionGrid } from './QuestionGrid';
import { ExamProgress } from './ExamProgress';
import { useState } from 'react';

export function MobileMenuButton() {
    const [open, setOpen] = useState(false);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="lg:hidden">
                <Button variant="outline" size="icon">
                    <Menu className="h-5 w-5" />
                </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-full sm:w-96">
                <SheetHeader>
                    <SheetTitle>Exam Navigation</SheetTitle>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                    <div>
                        <h3 className="font-semibold mb-3 text-sm">Progress</h3>
                        <ExamProgress />
                    </div>

                    <div>
                        <h3 className="font-semibold mb-3 text-sm">Questions</h3>
                        <QuestionGrid />
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}