# DashboardLocal

Desktop dashboard for managing hardware-career applications, prep assets, and markdown cover letters.

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

## Structure

- `src/renderer/features/dashboard/`: refactored dashboard application, presentation, and domain logic
- `electron/`: Electron main process, preload bridge, and file-backed repositories
- `shared/`: contracts and shared state defaults
- `coverletters_md/`: markdown cover letter workspace
- `dashboard_local_state.json`: persisted desktop dashboard state
- `archive/legacy/`: unused legacy implementations kept for review before deletion
