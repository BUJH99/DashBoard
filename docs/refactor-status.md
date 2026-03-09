# Refactor Status

기준일: 2026-03-09

## 현재 상태 요약

- 구조 리팩토링은 약 `99%` 진행된 상태로 판단합니다.
- 완료된 축
  - Electron 저장소/브리지 계층 분리
  - 대시보드 seed 데이터 분리
  - `useDashboardController` 1차 분해
  - 앱 레벨 메타데이터 분리
  - 대형 탭 UI 분해
  - `dashboard/types.ts`와 shared contract 분리
  - `dashboardActions.ts` 도메인별 액션 팩토리 분해
  - 커버레터 워크스페이스 상태 조립 책임 일부 분리
  - `useLeafletLocationMap.ts` 초기화/타일/마커 책임 분리
  - `useDashboardStateSynchronization.ts` 동기화 책임 분리
  - `DashboardCharts.tsx` 내부 컴포넌트 분리
  - `companySeed.ts` facade 전환 및 기업 데이터 분리
  - `dashboardViewModel.ts` 섹션 빌더 분리
  - Electron 메인/preload 소스 엔트리 복구
- 진행 중인 축
  - 패키징 경고 정리
- 남은 큰 축
  - 최종 미사용 파일/경고 정리

## 이번 단계에서 반영한 내용

### 1. 차트 파일 분해

- `src/renderer/components/charts/DashboardCharts.tsx`는 이제 export facade만 담당합니다.
- 실제 구현은 아래 파일로 분리했습니다.
  - `chartPrimitives.tsx`
  - `dashboardMetricCharts.tsx`
  - `dashboardComparisonCharts.tsx`
  - `dashboardPortfolioCharts.tsx`
- 차트 내부의 일부 깨진 라벨도 한국어로 복구했습니다.

### 2. 기업 seed 분해

- `companySeed.ts`는 4줄 facade로 축소했습니다.
- 실제 데이터는 아래 파일로 분리했습니다.
  - `companyTargetsSeed.ts`
  - `companySlugSeed.ts`
  - `companyDetailsSeed.ts`
  - `jobPostingSeed.ts`
- 기업명, 상태, 설명, 공고 요약은 UTF-8 기준 한국어로 다시 정리했습니다.

### 3. view-model 분해

- `dashboardViewModel.ts`는 섹션 조합만 맡도록 축소했습니다.
- 세부 로직은 아래로 분리했습니다.
  - `viewModel/dashboardViewModelTypes.ts`
  - `viewModel/dashboardViewModelSections.ts`
- overview, industry, companies, offer, location, portfolio, checklist, interview, essays, calendar, jdScanner 섹션이 각각 builder 함수로 분리됐습니다.

### 4. shared contract direct import 정리

- `desktop-contracts` 직접 사용은 호환 레이어 수준만 남겼습니다.
- 아래 파일을 추가해 사용처를 direct import로 전환했습니다.
  - `shared/dashboard-state-service-contracts.ts`
  - `shared/desktop-api-contracts.ts`
- `shared/desktop-contracts.ts`는 재수출 facade 역할만 유지합니다.

### 5. seed 문자열 UTF-8 복구

- 아래 seed 파일의 깨진 문구를 UTF-8 한국어로 다시 정리했습니다.
  - `industrySeed.ts`
  - `portfolioSeed.ts`
  - `interviewSeed.ts`
- 현재 `src`, `shared` 기준으로는 눈에 띄는 깨짐 문자가 더 남아 있지 않은 상태입니다.

### 6. Electron 엔트리 복구

- `electron/main.cts`
- `electron/preload.cts`
- `electron/main/index.cts`

위 3개 파일을 소스 기준으로 복구했습니다.

배경:
- 기존 빌드는 이전 `dist-electron` 산출물이 남아 있어서 통과하고 있었습니다.
- 즉, 소스 엔트리가 빠져 있어도 겉보기에는 정상처럼 보이는 상태였습니다.

현재는:
- 소스 엔트리 존재
- TypeScript 빌드 통과
- 패키징 통과

상태로 정리됐습니다.

## 현재 큰 파일 상태

- `src/renderer/components/charts/DashboardCharts.tsx` : 5 lines
- `src/renderer/features/dashboard/domain/seeds/companySeed.ts` : 4 lines
- `src/renderer/features/dashboard/controller/dashboardViewModel.ts` : 39 lines

## 남은 우선순위

### 1순위. 최종 정리

대상:
- 패키징 경고
- 승인된 미사용 파일 삭제 이후 재검증

목표:
- `build`, `electron:pack` 재검증
- 남은 경고의 원인 문서화 또는 제거

참고 문서:
- `docs/packaging-warnings.md`

## 현실적인 남은 범위

- 남은 건 사실상 문서/정리 작업 1회 수준입니다.
