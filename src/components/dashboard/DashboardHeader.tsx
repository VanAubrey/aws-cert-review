'use client';

import Link from 'next/link';
import { Award, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DashboardHeader() {
    return (
        <header className="border-b bg-card">
            <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <Award className="h-8 w-8 text-primary" />
                    <h1 className="text-2xl font-bold text-foreground">AWS CertReview</h1>
                </Link>

                <Link href="/">
                    <Button variant="outline" className="gap-2">
                        <LogOut className="h-4 w-4" />
                        <span className="hidden sm:inline">Exit</span>
                    </Button>
                </Link>
            </div>
        </header>
    );
}