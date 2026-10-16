# Recipe Generator Frontend

Standalone React, TypeScript, and Vite application for discovering recipes from a local bilingual dataset. Recipe matching does not require a backend.

## Requirements

- Node.js 20 or newer
- npm

## Setup

From this directory:

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

The development server listens on `http://localhost:5174`. The account, custom-product, and search-history features call the API configured by `VITE_API_BASE_URL`, which defaults to `http://localhost:8001`. To use a different API deployment, set that variable in `.env`; the API must allow this frontend origin and credentialed requests.

## Development commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Type-check the project and create a production build. |
| `npm run lint` | Run ESLint with warnings treated as errors. |
| `npm run typecheck` | Check the application and Vite configuration with TypeScript. |
| `npm run format` | Format source TypeScript, TSX, CSS, and Markdown with Prettier. |
