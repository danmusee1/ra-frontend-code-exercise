# Rainforest Alliance Staff

An internal staff management tool for browsing, adding, editing, and managing Rainforest Alliance team members. Built with a focus on accessibility (WCAG compliance) and a clean, responsive UI.

---

## Tech Stack

| Layer         | Technology                                  |
| ------------- | ------------------------------------------- |
| Framework     | React 19 + TypeScript                       |
| Build tool    | Vite 6                                      |
| Styling       | Tailwind CSS v4 + CSS custom properties     |
| Routing       | TanStack Router v1                          |
| Data fetching | TanStack Query v5                           |
| HTTP client   | Axios                                       |
| Mock API      | json-server                                 |
| Testing       | Vitest + React Testing Library + vitest-axe |
| Linting       | ESLint + TypeScript ESLint                  |

---

## Prerequisites

- Node.js `>= 18`
- npm `>= 10`

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

> `postinstall` automatically runs `node generate-members.js` to seed the mock server data.

### 2. Start the app

```bash
npm run dev
```

This concurrently starts:

- **Vite dev server** (React client) — typically at `http://localhost:5173`
- **json-server mock API** — at `http://localhost:4002` with a 1500ms simulated network delay

---

## Available Scripts

| Script                | Description                              |
| --------------------- | ---------------------------------------- |
| `npm run dev`         | Start client + mock API server together  |
| `npm run dev-client`  | Start Vite client only                   |
| `npm run dev-server`  | Start json-server mock API only          |
| `npm run health`      | Run lint, type-check, and tests together |
| `npm run health-lint` | ESLint check                             |
| `npm run health-type` | TypeScript type-check                    |
| `npm run health-test` | Run tests once (CI mode)                 |
| `npm test`            | Run tests in watch mode                  |

---

## Running Tests

```bash
# Run all tests once
npx vitest run

# Run in watch mode
npm test
```

Tests use **React Testing Library** and **Vitest**. Accessibility tests use **vitest-axe** against axe-core rules.

Test files live alongside the components they cover (`.test.tsx`) and under `src/pages/people/`.

---

## Folder Structure

```
src/
├── app/                  # App-level shell (header)
├── components/ui/        # Shared UI primitives (Button, Avatar, StatusBadge…)
├── features/
│   └── people/
│       ├── api/          # Axios API calls
│       ├── components/   # Feature-specific components + their tests
│       ├── hooks/        # usePeople, useDebounce
│       └── types/        # person.ts type definitions
├── icons/                # SVG icons (via vite-plugin-svgr)
├── lib/                  # TanStack Query client setup
├── pages/people/         # Page-level components (list, add/edit, view)
├── routes/               # TanStack Router route tree + root layout
├── test/                 # Global test providers, setup, a11y utilities
└── utils/                # Constants, formatters
```

---

## Routing

Routes are defined in `src/routes/route-tree.tsx` using TanStack Router.

| Path               | Page                                          |
| ------------------ | --------------------------------------------- |
| `/`                | People list (with search, filter, pagination) |
| `/people/new`      | Add a new person                              |
| `/people/edit/:id` | Edit an existing person                       |
| `/people/view`     | View a person's details                       |
| `*`                | Redirects to `/`                              |

The people list route validates and normalises URL search params (`q`, `status`, `page`, `pageSize`) so that filtered and paginated views are bookmarkable and survive the back button.

---

## Accessibility

This application is built to meet **WCAG 2.1 AA** standards.

- Semantic HTML throughout
- All interactive elements are keyboard navigable
- ARIA labels and roles applied where native semantics are insufficient
- Colour contrast ratios meet AA requirements
- Accessibility assertions are included in the test suite via `vitest-axe`

---

## Contributing

1. **Branch** off `main` with a descriptive name, e.g. `feat/add-export-button` or `fix/pagination-reset`.
2. **Follow existing patterns** — feature code lives in `src/features/`, pages in `src/pages/`, shared UI in `src/components/ui/`.
3. **Write tests** for any new component or behaviour. Co-locate test files as `ComponentName.test.tsx`.
4. **Check health before opening a PR:**
   ```bash
   npm run health
   ```
   This runs lint, type-check, and tests together. All three must pass.
5. **Accessibility** — if your change touches UI, verify it passes axe checks and is keyboard navigable.
6. **Keep PRs focused** — one concern per pull request makes review faster.
