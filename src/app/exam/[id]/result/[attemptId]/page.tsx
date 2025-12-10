import { notFound } from 'next/navigation';
import { ResultsInterface } from '@/components/results/ResultsInterface';

interface ResultsPageProps {
    params: Promise<{ id: string; attemptId: string }>;
}

export default async function ResultsPage({ params }: ResultsPageProps) {
    const { attemptId } = await params;

    if (!attemptId) {
        notFound();
    }

    return <ResultsInterface attemptId={attemptId} />;
}