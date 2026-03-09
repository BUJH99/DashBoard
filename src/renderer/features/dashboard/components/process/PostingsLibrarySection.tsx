import { Plus, Search } from "lucide-react";
import { ScrollArea } from "../../../../components/ui/ScrollArea";
import { Pill, SurfaceCard } from "../../../../components/ui/primitives";
import { cn } from "../../../../lib/cn";
import type { DashboardController } from "../../useDashboardController";

type PostingsLibrarySectionProps = {
  postings: DashboardController["postings"];
};

export function PostingsLibrarySection({
  postings,
}: PostingsLibrarySectionProps) {
  return (
    <SurfaceCard className="overflow-hidden">
      <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-900">채용공고 라이브러리</h3>
            <p className="mt-1 text-sm text-slate-500">
              공고를 선택하면 기업 분석, 체크리스트, 자소서 대상이 함께 맞춰집니다.
            </p>
          </div>
          <button
            type="button"
            onClick={postings.createPosting}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            새 공고
          </button>
        </div>
      </div>

      <div className="grid gap-3 p-4">
        <label className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={postings.postingQuery}
            onChange={(event) => postings.setPostingQuery(event.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 py-2.5 text-sm outline-none focus:border-cyan-300"
            placeholder="기업명, 직무명, 키워드 검색"
          />
        </label>
        <select
          value={postings.postingCompanyFilter}
          onChange={(event) => postings.setPostingCompanyFilter(event.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-cyan-300"
        >
          <option value="all">전체 기업</option>
          {postings.companyOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <ScrollArea className="h-[620px] px-3 pb-3">
        <div className="space-y-3">
          {postings.filteredPostings.length === 0 ? (
            <div className="rounded-[22px] border border-dashed border-slate-300 bg-slate-50/70 p-5 text-sm text-slate-500">
              현재 필터에 맞는 채용공고가 없습니다. 검색어나 기업 필터를 조정해 보세요.
            </div>
          ) : null}
          {postings.filteredPostings.map((posting) => (
            <button
              key={posting.id}
              type="button"
              onClick={() => postings.setSelectedPostingId(posting.id)}
              className={cn(
                "w-full rounded-[22px] border p-4 text-left transition",
                postings.selectedPosting.id === posting.id
                  ? "border-cyan-300 bg-cyan-50/50 shadow-sm"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-bold text-slate-900">{posting.company}</p>
                  <p className="mt-1 text-base font-semibold text-slate-800">{posting.title}</p>
                </div>
                <Pill className="border-slate-200 bg-slate-100 text-slate-700">
                  D-{posting.daysLeft}
                </Pill>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Pill className="border-cyan-200 bg-cyan-50 text-cyan-700">
                  {posting.stage}
                </Pill>
                <Pill className="border-amber-200 bg-amber-50 text-amber-700">
                  우선순위 {posting.priority}
                </Pill>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                {posting.summary}
              </p>
            </button>
          ))}
        </div>
      </ScrollArea>
    </SurfaceCard>
  );
}
