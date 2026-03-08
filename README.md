# DashboardLocal

Electron 기반 로컬 전용 취업 준비 대시보드입니다.

## Run

```powershell
npm install
npm start
```

## Build

```powershell
npm run build
npm run electron:pack
```

생성된 실행 파일 경로:

`C:\Users\tbdk5\Desktop\MAIN\0_Working\DashBoard\release\CareerDashboard-Desktop.exe`

## Structure

- `Dashboard_MERGED.tsx`: 메인 대시보드 UI
- `src/`: renderer entry 및 스타일
- `electron/`: Electron main/preload 및 로컬 파일 처리
- `coverletters_md/`: 자소서 markdown 폴더
- `dashboard_local_state.json`: 대시보드 로컬 상태 저장 파일
- `archive/legacy/`: 이전 프로토타입 보관
