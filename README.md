# helpdesk-web

Frontend of **Smart Helpdesk** — a support system where an AI service classifies customer
tickets, sets priority and drafts replies, and operators review and answer them.

The backend lives in [`helpdesk-backend`](https://github.com/helpdesk-teams/helpdesk-backend).
The frontend talks **only** to its api-gateway: `/api` (REST) and `/ws` (socket.io).

## Stack

Vue 3 (`<script setup>`, TypeScript) · Vite · Vue Router · Pinia · PrimeVue 4 (Aura theme) ·
Vitest + Vue Test Utils · ESLint + Oxlint + Prettier · husky + lint-staged

## Getting started

Requirements: Node.js `^22.18` or `>=24.12`.

```bash
npm install
cp .env.example .env.local   # then adjust values if needed
npm run dev                  # http://localhost:5173
```

### Environment variables

| Variable         | Example | Meaning                                            |
| ---------------- | ------- | -------------------------------------------------- |
| `VITE_API_URL`   | `/api`  | Base URL for REST requests                         |
| `VITE_WS_URL`    | (empty) | socket.io origin; empty = same origin as the page  |
| `VITE_USE_MOCKS` | `true`  | `true` — mock API with MSW, `false` — real backend |

## Scripts

| Command              | What it does                                  |
| -------------------- | --------------------------------------------- |
| `npm run dev`        | Start dev server with hot reload              |
| `npm run build`      | Type-check and build for production (`dist/`) |
| `npm run preview`    | Serve the production build locally            |
| `npm run lint`       | Run Oxlint and ESLint (with auto-fix)         |
| `npm run format`     | Format `src/` with Prettier                   |
| `npm run type-check` | Check types with `vue-tsc`                    |
| `npm run test:unit`  | Run unit tests with Vitest (watch mode)       |

A pre-commit hook (husky + lint-staged) lints and formats staged files automatically.

## Project structure

```
src/
├── api/          # HTTP layer: axios client and endpoint functions
├── socket/       # socket.io connection and subscriptions
├── stores/       # Pinia stores: auth, tickets, notifications
├── router/       # routes and navigation guards
├── views/        # pages: auth/, client/, operator/
├── components/   # tickets/, ai/, comments/, layout/, common/
├── composables/  # reusable composition functions
├── types/        # API data types (Ticket, Comment, User…)
└── utils/        # constants (statuses, categories, priorities), helpers
mocks/            # MSW handlers and fake data
tests/            # unit/ (Vitest), e2e/ (Playwright)
```

## Conventions

- Components never call axios directly — only functions from `src/api/`.
- Statuses, categories, priorities and their labels come from `src/utils/constants.ts`.
- Commits follow [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`,
  `refactor:`, `test:`, `chore:`.

## Why PrimeVue 4, not 5

PrimeVue 5, `@primeuix/themes` 3 and `primeicons` 8 are distributed under the commercial PrimeUI
License and show a license banner without a key. We pin the MIT-licensed versions:
`primevue ~4.5`, `@primeuix/themes ^2`, `primeicons ^7`. Do not upgrade them to the next major.
