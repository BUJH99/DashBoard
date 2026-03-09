import { BookOpen } from "lucide-react";
import { Pill, SurfaceCard } from "../../../../components/ui/primitives";
import type { DashboardController } from "../../useDashboardController";

type EssayLinkSectionProps = {
  essays: DashboardController["essays"];
  linkedExperiences: DashboardController["interview"]["experienceLibrary"];
};

export function EssayLinkSection({
  essays,
  linkedExperiences,
}: EssayLinkSectionProps) {
  return (
    <div className="grid gap-6">
      <SurfaceCard className="p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900">자소서 질문 연동</h3>
            <p className="mt-1 text-sm text-slate-500">면접 대비를 위해 연결된 자소서 문항을 함께 봅니다.</p>
          </div>
          <BookOpen className="h-5 w-5 text-cyan-600" />
        </div>
        <select
          value={essays.selectedEssay.id}
          onChange={(event) => essays.setSelectedEssayId(Number(event.target.value))}
          className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300"
        >
          {essays.essayQuestions.map((essay) => (
            <option key={essay.id} value={essay.id}>
              {essay.company} / {essay.type}
            </option>
          ))}
        </select>
        <div className="mt-4 rounded-2xl border border-slate-200 p-4">
          <p className="font-semibold text-slate-800">{essays.selectedEssay.question}</p>
          <p className="mt-2 text-sm text-slate-500">{essays.selectedEssay.draft}</p>
        </div>
      </SurfaceCard>

      <SurfaceCard className="p-6">
        <h3 className="mb-4 text-lg font-bold text-slate-900">연결 경험</h3>
        <div className="space-y-3">
          {linkedExperiences.map((experience) => (
            <div key={experience.id} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-800">{experience.title}</p>
                  <p className="mt-2 text-sm text-slate-600">{experience.summary}</p>
                </div>
                <Pill className="border-slate-200 bg-slate-100 text-slate-700">{experience.result}</Pill>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {experience.strengths.map((strength) => (
                  <Pill key={strength} className="border-slate-200 bg-slate-100 text-slate-700">
                    {strength}
                  </Pill>
                ))}
              </div>
            </div>
          ))}
        </div>
      </SurfaceCard>
    </div>
  );
}
