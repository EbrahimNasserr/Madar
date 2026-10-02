import type { Metadata } from "next";
import MadarDashboard from "@/components/teacher-os-dashboard";
import { QuizGradingWorkspace } from "@/components/dashboard/quizzes/QuizGradingWorkspace";

export const metadata: Metadata = {
  title: "تصحيح الاختبار",
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ id: string }> };

export default function QuizDetailPage({ params }: Props) {
  return (
    <MadarDashboard>
      <QuizGradingWorkspace params={params} />
    </MadarDashboard>
  );
}
