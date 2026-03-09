export type JdScanPhase = "idle" | "loading" | "result";

export type FlashcardItem = {
  category: string;
  q: string;
  a: string;
};

export type ExperienceItem = {
  id: number;
  title: string;
  category: string;
  strengths: string[];
  summary: string;
  result: string;
  reusableFor: string[];
  companies: string[];
};

export type EssayQuestion = {
  id: number;
  company: string;
  posting: string;
  type: string;
  question: string;
  limit: number;
  status: string;
  draft: string;
  linkedExperienceIds: number[];
};

export type JdScanState = {
  phase: JdScanPhase;
  text: string;
};

export type JdScanResult = {
  extracted: string[];
  matched: string[];
  missing: string[];
  coverage: number;
  recommendation: string;
};
