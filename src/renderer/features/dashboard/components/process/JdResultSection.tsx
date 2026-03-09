import {
  CircleAlert,
  CircleCheck,
  Lightbulb,
  Sparkles,
  Target,
} from "lucide-react";
import { Pill, ProgressBar, SurfaceCard } from "../../../../components/ui/primitives";
import type { DashboardController } from "../../useDashboardController";

type JdResultSectionProps = {
  jdScanner: DashboardController["jdScanner"];
};

function normalizeKeyword(value: string) {
  return value.toLowerCase().replace(/[^\p{Letter}\p{Number}]+/gu, "");
}

function buildExperienceRecommendations(jdScanner: DashboardController["jdScanner"]) {
  if (!jdScanner.result) {
    return [];
  }

  const referenceKeywords = [...jdScanner.result.extracted, ...jdScanner.result.matched].map(normalizeKeyword);

  return [...jdScanner.experienceLibrary]
    .map((item) => {
      const haystack = normalizeKeyword(
        [item.title, item.summary, item.result, item.strengths.join(" ")].join(" "),
      );
      const keywordScore = referenceKeywords.reduce(
        (score, keyword) => (keyword && haystack.includes(keyword) ? score + 1 : score),
        0,
      );
      const companyScore = item.companies.includes(jdScanner.selectedCompany.name) ? 3 : 0;

      return {
        ...item,
        score: keywordScore + companyScore,
      };
    })
    .sort((left, right) => right.score - left.score)
    .slice(0, 2);
}

function buildEssayRecommendations(jdScanner: DashboardController["jdScanner"]) {
  const sameCompanyEssays = jdScanner.essayQuestions.filter(
    (item) => item.company === jdScanner.selectedCompany.name,
  );

  if (sameCompanyEssays.length > 0) {
    return sameCompanyEssays.slice(0, 2);
  }

  return [jdScanner.selectedEssay];
}

function KeywordCluster({
  title,
  icon: Icon,
  items,
  pillClassName,
}: {
  title: string;
  icon: typeof CircleCheck;
  items: string[];
  pillClassName: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-slate-500" />
        <h4 className="text-sm font-black text-slate-900">{title}</h4>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <Pill key={item} className={pillClassName}>
            {item}
          </Pill>
        ))}
      </div>
    </div>
  );
}

export function JdResultSection({
  jdScanner,
}: JdResultSectionProps) {
  const result = jdScanner.result;
  const experienceRecommendations = buildExperienceRecommendations(jdScanner);
  const essayRecommendations = buildEssayRecommendations(jdScanner);

  return (
    <SurfaceCard className="min-h-[720px] overflow-hidden">
      <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-6 py-5">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-emerald-500" />
          <h3 className="text-[22px] font-black tracking-tight text-slate-900">Resume Mapper 결과</h3>
        </div>
        <Pill className="border-emerald-200 bg-emerald-50 text-emerald-700">
          {jdScanner.selectedCompany.name}
        </Pill>
      </div>

      {result ? (
        <div className="space-y-6 px-6 py-6">
          <div className="rounded-[30px] border border-slate-200 bg-white/70 px-6 py-7">
            <div className="mx-auto max-w-[380px] text-center">
              <p className="text-sm font-semibold text-slate-500">종합 매칭 점수</p>
              <p className="mt-2 text-6xl font-black tracking-tight text-emerald-600">
                {result.coverage}
                <span className="ml-1 text-3xl text-slate-400">%</span>
              </p>
              <div className="mt-5">
                <ProgressBar value={result.coverage} color="#10b981" />
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            <KeywordCluster
              title="공고에서 추출된 키워드"
              icon={Target}
              items={result.extracted}
              pillClassName="border-slate-200 bg-slate-100 text-slate-700"
            />
            <KeywordCluster
              title="이미 매칭되는 역량"
              icon={CircleCheck}
              items={result.matched}
              pillClassName="border-emerald-200 bg-emerald-50 text-emerald-700"
            />
            <KeywordCluster
              title="보강이 필요한 키워드"
              icon={CircleAlert}
              items={result.missing}
              pillClassName="border-rose-200 bg-rose-50 text-rose-700"
            />
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 px-5 py-4 text-sm leading-7 text-slate-600">
            {result.recommendation}
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <div className="rounded-[28px] border border-slate-200 bg-white/70 p-5">
              <h4 className="text-lg font-black tracking-tight text-slate-900">추천 연결 경험</h4>
              <div className="mt-4 grid gap-3">
                {experienceRecommendations.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-[22px] border border-slate-200 bg-slate-50/70 px-4 py-4"
                  >
                    <p className="text-[15px] font-black text-slate-900">{item.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{item.summary}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-500">{item.result}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white/70 p-5">
              <h4 className="text-lg font-black tracking-tight text-slate-900">연결할 자소서 문항</h4>
              <div className="mt-4 grid gap-3">
                {essayRecommendations.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-[22px] border border-slate-200 bg-slate-50/70 px-4 py-4"
                  >
                    <p className="text-sm leading-7 text-slate-700">{item.question}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Pill className="border-amber-200 bg-amber-50 text-amber-700">
                        {item.company}
                      </Pill>
                      <Pill className="border-slate-200 bg-slate-100 text-slate-700">
                        {item.type}
                      </Pill>
                      <Pill className="border-slate-200 bg-slate-100 text-slate-700">
                        {item.limit}자
                      </Pill>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex min-h-[620px] items-center justify-center px-6 py-10">
          <div className="max-w-[520px] rounded-[32px] border border-dashed border-slate-300 bg-slate-50/60 px-8 py-10 text-center">
            <Lightbulb className="mx-auto h-10 w-10 text-amber-400" />
            <h4 className="mt-4 text-xl font-black tracking-tight text-slate-900">
              JD 분석 결과가 아직 없습니다
            </h4>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              좌측에 공고 텍스트를 붙여 넣고 분석을 실행하면 키워드 매칭, 보강 포인트, 연결 경험과 자소서 문항까지 여기에 채워집니다.
            </p>
          </div>
        </div>
      )}
    </SurfaceCard>
  );
}
