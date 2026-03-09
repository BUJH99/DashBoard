export type PortfolioData = {
  profile: {
    initials: string;
    name: string;
    handle: string;
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
};
