# Unused Files

기준일: 2026-03-09

판정 기준:
- 현재 엔트리 `src/main.tsx`, `electron/main.cts`, `electron/preload.cts`
- 상대 import/export 그래프 기준 도달 가능 여부 확인
- `.cjs -> .cts`, `.js -> .ts` 매핑을 반영해 오탐을 줄임

## 1. 소스 코드 삭제 후보

현재 기준으로 추가 미사용 source 파일은 더 보이지 않습니다.

주의:
- `electron/main.cts`는 패키징 메인 엔트리라 유지해야 합니다.
- `electron/preload.cts`는 preload 엔트리 wrapper라 유지해야 합니다.
- `electron/main/index.cts`는 실제 Electron 부트스트랩 파일이라 유지해야 합니다.
- `src/desktop-api.d.ts`는 타입 선언 파일이라 유지해야 합니다.

## 2. legacy 정리 대상

아래는 현재 앱 엔트리에 연결되지 않은 보관 파일입니다.

- `archive/legacy/Dashboard_MERGED.tsx`
- `archive/legacy/Dashboard_GEMINI_ DESIGNFINAL.jsx`
- `archive/legacy/DashBoard_GPT_TECH STACK.tsx`
- `archive/legacy/dashboardSeed.ts`

추가 메모:
- 위 파일을 모두 지웠다면 `archive/legacy/README.md`도 같이 삭제 가능합니다.
- `archive/legacy/` 폴더가 비면 폴더 자체도 제거 가능합니다.

## 3. 안전 삭제 가능한 비소스 파일

아래는 앱 동작 코드와 직접 관계없는 파일입니다.

- `docs/git-auth-test.md`
  - Git 인증 저장 테스트용 문서
  - 현재 어떤 코드나 빌드 설정에서도 참조하지 않음

## 4. 조건부 삭제 가능한 로컬 데이터

아래는 "미사용"은 아니지만, 지워도 앱이 다시 만들 수 있는 로컬 데이터입니다.
다만 삭제하면 사용자 데이터가 초기화되거나 일부 문서가 사라집니다.

- `dashboard_local_state.json`
  - 대시보드 로컬 상태 저장 파일
  - 삭제 시 필터, 선택값, 메모 상태 등이 초기화됨
- `coverletters_md/`
  - 자기소개서 markdown 저장 폴더
  - 삭제 시 저장된 자기소개서 파일이 사라짐
  - 앱은 폴더를 다시 만들 수 있지만 내용은 복구되지 않음

## 5. 언제든 재생성 가능한 산출물

- `dist/`
- `dist-electron/`
- `release/`
- `node_modules/`

주의:
- `dist/`, `dist-electron/`, `release/`는 빌드 산출물이라 삭제해도 다시 생성 가능합니다.
- `node_modules/`는 삭제 가능하지만 이후 `npm install`이 다시 필요합니다.
- 실행 파일을 바로 써야 하면 `release/` 삭제 전에 백업 여부를 먼저 판단해야 합니다.

## 6. 현재 결론

현재 기준 추가 삭제 후보는 아래 수준입니다.

- 바로 지워도 되는 것
  - `docs/git-auth-test.md`
- 비면 같이 지워도 되는 것
  - `archive/legacy/README.md`
  - `archive/legacy/`
- 재생성 가능한 것
  - `dist/`
  - `dist-electron/`
  - `release/`
  - `node_modules/`
- 초기화 목적일 때만 지울 것
  - `dashboard_local_state.json`
  - `coverletters_md/`

남아 있는 source 코드 쪽에서는, 현재 기준 추가 삭제 후보가 더 나오지 않았습니다.
