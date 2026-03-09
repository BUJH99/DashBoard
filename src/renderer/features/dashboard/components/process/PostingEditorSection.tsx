import { Link2, Save, Trash2 } from "lucide-react";
import { GlassSelect } from "../../../../components/ui/GlassSelect";
import { Pill, SurfaceCard } from "../../../../components/ui/primitives";
import type { DashboardController } from "../../useDashboardController";

type PostingEditorSectionProps = {
  postings: DashboardController["postings"];
};

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="font-semibold text-slate-700">{label}</span>
      <input
        type="number"
        min={0}
        max={100}
        value={value}
        onChange={(event) => onChange(Number(event.target.value || 0))}
        className="rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300"
      />
    </label>
  );
}

export function PostingEditorSection({
  postings,
}: PostingEditorSectionProps) {
  const selectedPosting = postings.selectedPosting;

  return (
    <div className="grid gap-6">
      <SurfaceCard className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">공고 편집기</h3>
            <p className="mt-1 text-sm text-slate-500">
              현재 공고를 수정하면 전체 현황, 기업 분석, 체크리스트, 자소서 기본 대상에 바로 반영됩니다.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void postings.saveChanges()}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
            >
              <Save className="h-4 w-4" />
              공고 저장
            </button>
            <button
              type="button"
              onClick={() => postings.deletePosting(selectedPosting.id)}
              disabled={!postings.canDelete}
              className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Trash2 className="h-4 w-4" />
              선택 공고 삭제
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Pill className="border-cyan-200 bg-cyan-50 text-cyan-700">
            {selectedPosting.company}
          </Pill>
          <Pill className="border-slate-200 bg-slate-100 text-slate-700">
            {selectedPosting.stage}
          </Pill>
          <Pill className="border-amber-200 bg-amber-50 text-amber-700">
            우선순위 {selectedPosting.priority}
          </Pill>
        </div>

        <div className="mt-5 rounded-3xl border border-cyan-100 bg-cyan-50/60 p-4 text-sm text-cyan-900">
          <div className="flex items-center gap-2 font-semibold">
            <Link2 className="h-4 w-4" />
            연결 범위
          </div>
          <p className="mt-2 leading-relaxed">
            이 공고를 선택하면 기업 분석의 기준 공고, 체크리스트 대상, 자기소개서 기본 직무명이 같은 공고를 바라보게 됩니다.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="grid gap-1 text-sm">
            <span className="font-semibold text-slate-700">기업</span>
            <GlassSelect
              ariaLabel="공고 기업 선택"
              value={String(selectedPosting.targetCompanyId)}
              options={postings.companyOptions}
              onChange={(value) =>
                postings.updatePosting(selectedPosting.id, {
                  targetCompanyId: Number(value),
                })
              }
              tone="cyan"
              size="sm"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-semibold text-slate-700">전형 단계</span>
            <GlassSelect
              ariaLabel="공고 전형 단계 선택"
              value={selectedPosting.stage}
              onChange={(value) =>
                postings.updatePosting(selectedPosting.id, {
                  stage: value,
                })
              }
              options={postings.stageOptions.map((stage) => ({
                value: stage,
                label: stage,
              }))}
              tone="amber"
              size="sm"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-semibold text-slate-700">공고 제목</span>
            <input
              value={selectedPosting.title}
              onChange={(event) =>
                postings.updatePosting(selectedPosting.id, {
                  title: event.target.value,
                })
              }
              className="rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-semibold text-slate-700">직무 코드</span>
            <input
              value={selectedPosting.role}
              onChange={(event) =>
                postings.updatePosting(selectedPosting.id, {
                  role: event.target.value,
                })
              }
              className="rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-semibold text-slate-700">마감일</span>
            <input
              type="date"
              value={selectedPosting.deadline}
              onChange={(event) =>
                postings.updatePosting(selectedPosting.id, {
                  deadline: event.target.value,
                })
              }
              className="rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300"
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span className="font-semibold text-slate-700">키워드</span>
            <input
              value={selectedPosting.keywords.join(", ")}
              onChange={(event) =>
                postings.updatePostingKeywords(selectedPosting.id, event.target.value)
              }
              className="rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300"
              placeholder="예: RTL, AMBA AXI, CDC"
            />
          </label>
        </div>

        <label className="mt-4 grid gap-1 text-sm">
          <span className="font-semibold text-slate-700">요약 메모</span>
          <textarea
            value={selectedPosting.summary}
            onChange={(event) =>
              postings.updatePosting(selectedPosting.id, {
                summary: event.target.value,
              })
            }
            className="min-h-[110px] rounded-2xl border border-slate-200 px-3 py-2 outline-none focus:border-cyan-300"
          />
        </label>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <NumberField
            label="적합도"
            value={selectedPosting.fit}
            onChange={(value) => postings.updatePosting(selectedPosting.id, { fit: value })}
          />
          <NumberField
            label="우선 대응도"
            value={selectedPosting.urgency}
            onChange={(value) => postings.updatePosting(selectedPosting.id, { urgency: value })}
          />
          <NumberField
            label="성장성"
            value={selectedPosting.growth}
            onChange={(value) => postings.updatePosting(selectedPosting.id, { growth: value })}
          />
          <NumberField
            label="부담도"
            value={selectedPosting.burden}
            onChange={(value) => postings.updatePosting(selectedPosting.id, { burden: value })}
          />
          <NumberField
            label="위치 적합도"
            value={selectedPosting.locationFit}
            onChange={(value) => postings.updatePosting(selectedPosting.id, { locationFit: value })}
          />
          <NumberField
            label="자소서 준비도"
            value={selectedPosting.selfIntroReady}
            onChange={(value) =>
              postings.updatePosting(selectedPosting.id, { selfIntroReady: value })
            }
          />
        </div>

        {postings.saveMessage ? (
          <p className="mt-4 text-xs font-medium text-slate-500">{postings.saveMessage}</p>
        ) : null}
      </SurfaceCard>
    </div>
  );
}
