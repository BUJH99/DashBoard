import { FileText, RotateCcw, Search, Sparkles } from "lucide-react";
import { Pill, SurfaceCard } from "../../../../components/ui/primitives";
import { cn } from "../../../../lib/cn";
import type { DashboardController } from "../../useDashboardController";

type JdInputSectionProps = {
  jdScanner: DashboardController["jdScanner"];
};

function getPhaseLabel(phase: DashboardController["jdScanner"]["jdScan"]["phase"]) {
  if (phase === "loading") {
    return "분석 중";
  }
  if (phase === "result") {
    return "결과 준비됨";
  }
  return "대기 중";
}

export function JdInputSection({
  jdScanner,
}: JdInputSectionProps) {
  const text = jdScanner.jdScan.text;
  const trimmedText = text.trim();
  const lineCount = trimmedText ? trimmedText.split(/\n+/).length : 0;
  const keywordHints = ["Verilog", "SystemVerilog", "UVM", "AMBA AXI", "CDC Analysis", "FPGA"];

  return (
    <SurfaceCard className="flex min-h-[720px] flex-col overflow-hidden">
      <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-slate-500" />
            <h3 className="text-[22px] font-black tracking-tight text-slate-900">
              채용 공고 텍스트 붙여넣기
            </h3>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            우대사항과 역할 설명을 넣으면 보유 역량과 연결 가능한 경험을 기준으로 바로 매칭합니다.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            onClick={jdScanner.runJdAnalysis}
            disabled={!trimmedText || jdScanner.jdScan.phase === "loading"}
            className={cn(
              "inline-flex h-12 items-center gap-2 rounded-2xl bg-slate-900 px-5 text-sm font-bold text-white transition duration-200",
              "hover:-translate-y-0.5 hover:bg-slate-800 active:translate-y-0 active:scale-[0.98]",
              "disabled:cursor-not-allowed disabled:bg-slate-300",
            )}
          >
            <Search className={cn("h-4 w-4", jdScanner.jdScan.phase === "loading" && "animate-pulse")} />
            {jdScanner.jdScan.phase === "loading" ? "분석 중..." : "분석하기"}
          </button>
          <button
            type="button"
            onClick={jdScanner.resetJdAnalysis}
            className="inline-flex h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-bold text-slate-600 transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50 active:translate-y-0 active:scale-[0.98]"
          >
            <RotateCcw className="h-4 w-4" />
            결과 초기화
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-slate-200 px-6 py-4">
        <Pill className="border-slate-200 bg-slate-100 text-slate-700">
          상태: {getPhaseLabel(jdScanner.jdScan.phase)}
        </Pill>
        <Pill className="border-blue-200 bg-blue-50 text-blue-700">
          {trimmedText.length}자
        </Pill>
        <Pill className="border-emerald-200 bg-emerald-50 text-emerald-700">
          {lineCount}개 문단
        </Pill>
      </div>

      <div className="flex flex-1 flex-col px-6 py-5">
        <textarea
          value={text}
          onChange={(event) => jdScanner.setText(event.target.value)}
          className="min-h-[460px] flex-1 rounded-[28px] border border-slate-200 bg-slate-50/70 px-5 py-5 text-[15px] leading-8 text-slate-700 outline-none transition focus:border-cyan-300 focus:bg-white"
          placeholder="우대사항, 필수 역량, 직무 설명을 여기에 붙여 넣으세요."
        />

        <div className="mt-5 rounded-[26px] border border-slate-200 bg-white/70 p-5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-emerald-500" />
            <p className="text-sm font-black text-slate-900">스캔 힌트</p>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            필수 역량, 우대사항, 사용하는 프로토콜/툴, 팀 역할 설명이 함께 들어가면 추천 경험과 자소서 연결도가 더 좋아집니다.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {keywordHints.map((item) => (
              <Pill key={item} className="border-slate-200 bg-slate-50 text-slate-600">
                {item}
              </Pill>
            ))}
          </div>
        </div>
      </div>
    </SurfaceCard>
  );
}
