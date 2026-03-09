import type { CompanyTarget } from "../types";

export const STRATEGY_FIT_THRESHOLD = 80;
export const STRATEGY_PREFERENCE_THRESHOLD = 85;

export type StrategyQuadrantId = "observe" | "stretch" | "stable" | "focus";

export type StrategyMatrixPoint = {
  id: number;
  name: string;
  shortName: string;
  fit: number;
  preference: number;
  type: string;
  status: string;
  stage: CompanyTarget["stage"];
  strategicScore: number;
  quadrantId: StrategyQuadrantId;
  rank: number;
};

export type StrategyQuadrantSummary = {
  id: StrategyQuadrantId;
  label: string;
  description: string;
  count: number;
};

export type StrategyAxisScale = {
  min: number;
  max: number;
  ticks: number[];
  threshold: number;
};

export type StrategyMatrixModel = {
  points: StrategyMatrixPoint[];
  selectedPoint: StrategyMatrixPoint;
  fitScale: StrategyAxisScale;
  preferenceScale: StrategyAxisScale;
  averages: {
    fit: number;
    preference: number;
    score: number;
  };
  quadrantSummaries: StrategyQuadrantSummary[];
  topPriorityPoint: StrategyMatrixPoint;
};

const QUADRANT_META: Record<
  StrategyQuadrantId,
  Pick<StrategyQuadrantSummary, "label" | "description">
> = {
  observe: {
    label: "관찰 구간",
    description: "적합도와 선호도가 모두 낮아 시간을 최소 투입합니다.",
  },
  stretch: {
    label: "스트레치 구간",
    description: "선호도는 높지만 적합도 보완이 필요한 도전 카드입니다.",
  },
  stable: {
    label: "안정 구간",
    description: "적합도는 높고 선호도는 중간인 실속형 카드입니다.",
  },
  focus: {
    label: "집중 투자 구간",
    description: "적합도와 선호도가 모두 높아 우선순위를 가장 높게 둡니다.",
  },
};

function clampScaleMin(value: number, floor: number) {
  return Math.max(Math.floor(value / 5) * 5, floor);
}

function buildTicks(min: number, max: number) {
  const interval = max - min <= 25 ? 5 : 10;
  const ticks: number[] = [];

  for (let value = min; value <= max; value += interval) {
    ticks.push(value);
  }

  if (!ticks.includes(max)) {
    ticks.push(max);
  }

  return ticks;
}

function buildScale(values: number[], threshold: number, floor: number): StrategyAxisScale {
  const minValue = Math.min(...values, threshold);
  const min = clampScaleMin(minValue - 8, floor);
  const max = 100;

  return {
    min,
    max,
    threshold,
    ticks: buildTicks(min, max),
  };
}

function buildShortName(name: string) {
  return name.replace("삼성전자 ", "").replace(" ", "\n");
}

function resolveQuadrantId(fit: number, preference: number): StrategyQuadrantId {
  if (fit >= STRATEGY_FIT_THRESHOLD && preference >= STRATEGY_PREFERENCE_THRESHOLD) {
    return "focus";
  }
  if (fit < STRATEGY_FIT_THRESHOLD && preference >= STRATEGY_PREFERENCE_THRESHOLD) {
    return "stretch";
  }
  if (fit >= STRATEGY_FIT_THRESHOLD && preference < STRATEGY_PREFERENCE_THRESHOLD) {
    return "stable";
  }

  return "observe";
}

function buildPoint(target: CompanyTarget): Omit<StrategyMatrixPoint, "rank"> {
  return {
    id: target.id,
    name: target.name,
    shortName: buildShortName(target.name),
    fit: target.fit,
    preference: target.preference,
    type: target.type,
    status: target.status,
    stage: target.stage,
    strategicScore: Math.round(target.fit * 0.55 + target.preference * 0.45),
    quadrantId: resolveQuadrantId(target.fit, target.preference),
  };
}

export function buildStrategyMatrixModel(
  companyTargets: CompanyTarget[],
  selectedId: number,
): StrategyMatrixModel {
  const rankedPoints = companyTargets
    .map(buildPoint)
    .sort((left, right) => {
      if (right.strategicScore !== left.strategicScore) {
        return right.strategicScore - left.strategicScore;
      }
      if (right.preference !== left.preference) {
        return right.preference - left.preference;
      }
      return right.fit - left.fit;
    })
    .map((point, index) => ({
      ...point,
      rank: index + 1,
    }));

  const selectedPoint =
    rankedPoints.find((point) => point.id === selectedId) ?? rankedPoints[0];

  const fitScale = buildScale(
    rankedPoints.map((point) => point.fit),
    STRATEGY_FIT_THRESHOLD,
    60,
  );
  const preferenceScale = buildScale(
    rankedPoints.map((point) => point.preference),
    STRATEGY_PREFERENCE_THRESHOLD,
    70,
  );

  const quadrantSummaries = Object.entries(QUADRANT_META).map(([id, meta]) => ({
    id: id as StrategyQuadrantId,
    label: meta.label,
    description: meta.description,
    count: rankedPoints.filter((point) => point.quadrantId === id).length,
  }));

  const averages = rankedPoints.reduce(
    (accumulator, point) => ({
      fit: accumulator.fit + point.fit,
      preference: accumulator.preference + point.preference,
      score: accumulator.score + point.strategicScore,
    }),
    { fit: 0, preference: 0, score: 0 },
  );

  return {
    points: rankedPoints,
    selectedPoint,
    fitScale,
    preferenceScale,
    averages: {
      fit: Math.round(averages.fit / rankedPoints.length),
      preference: Math.round(averages.preference / rankedPoints.length),
      score: Math.round(averages.score / rankedPoints.length),
    },
    quadrantSummaries,
    topPriorityPoint: rankedPoints[0],
  };
}
