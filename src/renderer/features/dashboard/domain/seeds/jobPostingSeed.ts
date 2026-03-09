import type { JobPosting } from "../../types";
import { DEFAULT_DASHBOARD_JOB_POSTINGS } from "../../../../../../shared/dashboard-editable-data";

export const jobPostings: JobPosting[] = DEFAULT_DASHBOARD_JOB_POSTINGS.map((posting) => ({
  ...posting,
  keywords: [...posting.keywords],
}));
