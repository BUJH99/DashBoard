import type {
  CompanyPipelineStage,
  CompanyTarget,
  EnrichedPosting,
} from "../types";

const POSTING_STAGE_TO_PIPELINE_STAGE: Record<string, CompanyPipelineStage> = {
  "서류 제출": "applied",
  "서류 합격": "test",
  과제: "test",
  "인적성 예정": "test",
  "1차 면접": "interview1",
  "2차 면접": "interview2",
};

function resolvePipelineStage(stage: string): CompanyPipelineStage {
  return POSTING_STAGE_TO_PIPELINE_STAGE[stage] ?? "preparing";
}

function resolveStageRank(stage: string) {
  if (stage === "2차 면접") {
    return 5;
  }
  if (stage === "1차 면접") {
    return 4;
  }
  if (stage === "과제" || stage === "인적성 예정") {
    return 3;
  }
  if (stage === "서류 합격") {
    return 2;
  }
  if (stage === "서류 제출") {
    return 1;
  }

  return 0;
}

function comparePostingProgress(left: EnrichedPosting, right: EnrichedPosting) {
  const stageRankDiff = resolveStageRank(right.stage) - resolveStageRank(left.stage);
  if (stageRankDiff !== 0) {
    return stageRankDiff;
  }

  if (right.priority !== left.priority) {
    return right.priority - left.priority;
  }

  return left.daysLeft - right.daysLeft;
}

export function buildCompanyTargetsFromPostings(
  baseTargets: CompanyTarget[],
  postings: EnrichedPosting[],
) {
  return baseTargets.map((company) => {
    const leadPosting = postings
      .filter((posting) => posting.targetCompanyId === company.id)
      .sort(comparePostingProgress)[0];

    if (!leadPosting) {
      return company;
    }

    return {
      ...company,
      status: leadPosting.stage,
      stage: resolvePipelineStage(leadPosting.stage),
    };
  });
}
