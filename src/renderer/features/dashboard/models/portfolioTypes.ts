export type ExperienceHubCategory =
  | "project"
  | "internship"
  | "activity"
  | "contest"
  | "research";

export type ExperienceHubItem = {
  id: number;
  title: string;
  category: ExperienceHubCategory;
  organization: string;
  period: string;
  role: string;
  teamLabel: string;
  featured: boolean;
  tags: string[];
  overview: string;
  outcome: string;
  learning: string;
  rawBullet: string;
  improvedBullet: string;
  bulletReason: string;
  keywords: string[];
};

export type ResumeEducationItem = {
  school: string;
  degree: string;
  major: string;
  gpa: string;
  period: string;
  statusLabel?: string;
};

export type ResumeCertificateItem = {
  name: string;
  issuer: string;
  date: string;
};

export type ResumeLanguageItem = {
  name: string;
  detail: string;
  levelLabel?: string;
};

export type ResumeSkillSpecItem = {
  name: string;
  track: string;
  levelLabel: "상" | "중" | "하";
};

export type ResumeAwardItem = {
  title: string;
  issuer: string;
};

export type ResumePaperItem = {
  title: string;
};

export type PortfolioData = {
  profile: {
    initials: string;
    name: string;
    handle: string;
  };
  resumeProfile: {
    email: string;
    headline: string;
    education: ResumeEducationItem[];
    certificates: ResumeCertificateItem[];
    languages: ResumeLanguageItem[];
    skillSpecs: ResumeSkillSpecItem[];
    awards: ResumeAwardItem[];
    papers: ResumePaperItem[];
  };
  readiness: number;
  githubCommits: number;
  resumeUpdated: string;
  skills: { name: string; level: number }[];
  learningSkills: { name: string; progress: number; status: string }[];
  coursework: { id: number; name: string; grade: string; relevance: number; tags: string[] }[];
  studyProjects: { id: number; name: string; tech: string; progress: number; status: string; next: string }[];
  studyNotes: { id: number; title: string; date: string; category: string; preview: string }[];
  projects: { id: number; name: string; date: string; role: string; tech: string[]; impact: string; link: string }[];
  experienceHub: ExperienceHubItem[];
};
