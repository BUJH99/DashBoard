import type { ApplicationChecklistItem } from "../../types";

function buildChecklist(company: string, role: string): ApplicationChecklistItem[] {
  return [
    {
      id: "resume-tailored",
      label: `${company} ${role} 기준으로 이력서 bullet 재정리`,
      category: "documents",
      done: false,
      note: "",
      blocked: false,
    },
    {
      id: "company-research",
      label: "사업, 제품, 팀 맥락 요약",
      category: "research",
      done: false,
      note: "",
      blocked: false,
    },
    {
      id: "story-bank",
      label: "설계 사례 1개와 디버그 사례 1개 연결",
      category: "story",
      done: false,
      note: "",
      blocked: false,
    },
    {
      id: "submission-pass",
      label: "파일명, 날짜, 첨부물 최종 점검",
      category: "submission",
      done: false,
      note: "",
      blocked: false,
    },
  ];
}

type ChecklistTemplateSource = {
  id: number;
  company: string;
  title: string;
};

export function buildChecklistTemplates(postings: ChecklistTemplateSource[]) {
  return Object.fromEntries(
    postings.map((posting) => [
      posting.id,
      buildChecklist(posting.company, posting.title),
    ]),
  ) as Record<number, ApplicationChecklistItem[]>;
}

export const checklistTemplates: Record<number, ApplicationChecklistItem[]> = {
  101: buildChecklist("삼성전자 DS", "RTL 설계"),
  102: buildChecklist("SK하이닉스", "컨트롤러 RTL"),
  103: buildChecklist("LX세미콘", "디스플레이 검증"),
  104: buildChecklist("리벨리온", "AI 가속기 RTL"),
  105: buildChecklist("텔레칩스", "Automotive SoC"),
  106: buildChecklist("파두", "SSD 컨트롤러"),
};
