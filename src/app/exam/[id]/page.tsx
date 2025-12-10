import { notFound } from "next/navigation";
import { ExamInterface } from "@/components/exam/ExamInterface";

interface ExamPageProps {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ mode?: string }>;
}

export default async function ExamPage({
    params,
    searchParams,
}: ExamPageProps) {
    const { id } = await params;
    const { mode } = await searchParams;

    // Validate exam mode
    if (!mode || (mode !== "timed" && mode !== "untimed")) {
        notFound();
    }

    return <ExamInterface examId={id} mode={mode as "timed" | "untimed"} />;
}
