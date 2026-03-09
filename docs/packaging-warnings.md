# Packaging Warnings

기준일: 2026-03-09

## 현재 남아 있는 경고

`npm run electron:pack` 실행 시 아래 두 경고가 반복됩니다.

1. `duplicate dependency references`
2. `DEP0190` deprecation warning

## 1. duplicate dependency references

출력 예시:

- `@fullcalendar/core@6.1.20`
- `react-dom@19.2.4`

### 원인

- `@fullcalendar/daygrid`
- `@fullcalendar/interaction`
- `@fullcalendar/list`
- `@fullcalendar/react`
- `@fullcalendar/timegrid`

위 패키지들이 모두 `@fullcalendar/core`를 다시 참조합니다.

또한 `@fullcalendar/react`는 `react-dom`을 peer dependency로 참조합니다.

현재 로컬 `npm ls` 기준으로 실제 설치는 dedupe 되어 있습니다. 즉, 패키지가 여러 벌로 설치된 문제는 아니고, `electron-builder`가 의존성 그래프를 수집하면서 동일 패키지 참조를 여러 번 경고로 보여주는 케이스입니다.

### 현재 판단

- 기능 오류 아님
- 빌드 실패 원인 아님
- 패키징 결과물 실행에는 영향 없음

### 바로 줄이기 어려운 이유

- `@fullcalendar/core`는 `ko` locale import 때문에 직접 의존성이 필요합니다.
- 다른 FullCalendar 플러그인도 같은 core를 내부적으로 참조합니다.
- 따라서 현재 구조에서는 경고를 완전히 제거하기 어렵습니다.

## 2. DEP0190

출력 예시:

- `Passing args to a child process with shell option true ...`

### 원인

- 현재 보이는 로그는 우리 앱 코드가 아니라 `electron-builder` 내부 실행 경로에서 발생합니다.
- 즉, 패키저 구현이 Node deprecation 경고를 발생시키는 케이스입니다.

### 현재 판단

- 기능 오류 아님
- 빌드 실패 원인 아님
- 앱 런타임 경고가 아니라 패키징 시점 경고

## 결론

현재 남은 패키징 경고는 둘 다:

- 로컬 빌드 성공
- 패키징 성공
- 실행 파일 생성 성공

상태에서 발생하는 비치명 경고입니다.

실제로 제거를 시도하려면:

1. FullCalendar 의존성 묶음을 다른 캘린더 스택으로 교체하거나
2. `electron-builder` 버전/동작 변경을 검토해야 합니다.

현재 우선순위에서는 경고 제거보다 기능/구조 안정성이 더 중요하다고 판단합니다.
