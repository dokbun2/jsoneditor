# Repository Guidelines

## Project Structure & Module Organization
The application runs on Vite with React and TypeScript. `src/main.tsx` boots `App-Enhanced.tsx`, while feature views stay in `src/pages` and reusable building blocks are grouped under `src/components` and re-exported through the `@/` alias defined in `tsconfig.json`. Shared helpers (for example the `cn` utility) live in `src/utils`, and design tokens or Tailwind extensions belong in `src/styles`. Global CSS is in `styles.css`; static scaffolding stays in `index.html`. Build artifacts are emitted to `dist/`, and deployment configuration lives alongside scripts such as `deploy.sh`.

## Build, Test, and Development Commands
Run `npm install` to sync dependencies. `npm run dev` starts the Vite dev server with hot reloading and Tailwind JIT. `npm run build` performs a type check (`tsc`) and generates production assets in `dist/`. `npm run preview` serves the built files locally for smoke testing. When publishing, `npm run deploy` pushes `dist/` to GitHub Pages via `gh-pages`; ensure the directory is clean beforehand.

## Coding Style & Naming Conventions
Adopt TypeScript’s strict mode defaults and prefer functional React components typed as `React.FC`. Use two-space indentation and single quotes, matching the existing sources. Name components and files that export components in PascalCase (`components/ClipboardIcon.tsx`), utility files in camelCase (`utils/cn.ts`). Keep Tailwind class strings concise and lean on `clsx`/`tailwind-merge` for conditional styling. Localized strings (e.g., Korean error translations) should stay centralized to simplify updates.

## Testing Guidelines
Automated testing is not yet wired up; when adding logic-heavy utilities, introduce Vitest alongside Testing Library and place specs next to the code (`src/utils/fixJson.test.ts`). At minimum, describe manual verification in your PR by covering JSON parsing, formatting, download, and clipboard flows via `npm run dev`. Always confirm `npm run build` passes before submitting.

## Commit & Pull Request Guidelines
Write commits in imperative, present-tense English such as `Add Monaco editor formatting actions`, grouping related changes together. PRs should include a concise summary, linked issues, screenshots or GIFs for UI tweaks, and a checklist of manual tests performed. Mention any follow-up tasks or configuration adjustments (for example updates to `deploy.sh` or hosting settings) so reviewers can validate them quickly.
