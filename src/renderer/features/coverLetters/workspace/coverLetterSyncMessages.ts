export const COVER_LETTER_SYNC_MESSAGES = {
  syncFailed: "자기소개서 목록을 불러오지 못했습니다.",
  loadFailed: "자기소개서 파일을 불러오지 못했습니다.",
  createSucceeded: "새 자기소개서 초안을 만들었습니다.",
  createFailed: "새 자기소개서 초안 생성에 실패했습니다.",
  saveSucceeded: "자기소개서를 저장했습니다.",
  saveFailed: "자기소개서 저장에 실패했습니다.",
  deleteSucceeded: "자기소개서 파일을 삭제했습니다.",
  deleteFailed: "자기소개서 파일 삭제에 실패했습니다.",
} as const;

export function resolveCoverLetterErrorMessage(fallbackMessage: string, error: unknown) {
  return error instanceof Error ? error.message : fallbackMessage;
}
