import type { CommuteNote, OriginPreset } from "../../types";

export const originPresets: OriginPreset[] = [
  { label: "수원역", value: "수원역", lat: 37.26605, lng: 126.9997, type: "SUBWAY_STATION" },
  { label: "서울역", value: "서울역", lat: 37.554648, lng: 126.970611, type: "SUBWAY_STATION" },
  { label: "강남역", value: "강남역", lat: 37.497175, lng: 127.027926, type: "SUBWAY_STATION" },
  { label: "판교역", value: "판교역", lat: 37.394761, lng: 127.111217, type: "SUBWAY_STATION" },
];

export const commuteNotesSeed: Record<number, CommuteNote> = {
  1: { totalMinutes: "70", transfers: "1", hasBus: false, hasSubway: true, note: "지하철 위주라 안정적이지만 오전 면접은 여유 시간을 더 두는 편이 좋습니다." },
  2: { totalMinutes: "105", transfers: "2", hasBus: true, hasSubway: true, note: "통근이 길어서 오퍼 비교 시 중요한 감점 요소가 됩니다." },
  4: { totalMinutes: "48", transfers: "1", hasBus: false, hasSubway: true, note: "상위 타깃 중 스타트업 기준으로는 가장 무난한 동선입니다." },
};
