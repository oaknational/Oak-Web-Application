# Agentic Coding Copilot **Principles** – Next.js & TypeScript

These guidelines are intentionally _principle‑driven_. Adapt concrete details (folder names, file structure, build tooling) to the repository you are working in, but **never compromise on testing or type safety**.

---

## 0 THE PRIME DIRECTIVE

**Test‑Driven Development (TDD) is mandatory.** Write a failing test _first_, then make it pass, then refactor. Every new behaviour or bug fix must follow this cycle.

> _"If it isn’t covered by a test, assume it doesn’t work."_

After each change, run the project’s quality gate (type‑check → lint → test → build) locally or via CI and resolve _all_ issues.

---

## 1  Code Style & Organisation

**Principles – not prescriptions**:

- **Consistency over novelty** — conform to the established style of the repository. If none exists, adopt a recognised community preset (e.g. Prettier defaults).
- **Small, focused units** — break code out when a file or function starts handling more than one concept. (No fixed LOC limits; use judgement.)
- **Descriptive naming** — choose names that reveal intent. Align with common TypeScript conventions (PascalCase types/components, camelCase functions/variables, UPPER_SNAKE_CASE constants) unless the repository dictates otherwise.
- **Immutability by default** — prefer `readonly` constructs and pure functions where practical.
- **Log responsibly** — use the project’s logger or dependency‑injected logging; avoid stray `console.*`.

---

## 2  Type Safety & Runtime Validation

- **Zero‑`any` policy** — when uncertain, use `unknown` and narrow with type guards or schemas (Zod/Valibot).
- **Prefer guards over casts** — `value is Foo` > `as Foo`.
- **Opaque/branded types** for identifiers to avoid accidental mix‑ups.
- **Discriminated unions** for variant data.
- **Guard → Parse → Model** flow for external input: validate first, transform second, use strongly‑typed models thereafter.

---

## 3  Architecture & Separation of Concerns

_Keep coupling low, cohesion high._ Typical layers (rename as project dictates):

1. **Presentation / UI** — React components, server or client.
2. **Server actions / API** — request handling and side‑effects.
3. **Domain services** — pure business logic, reusable.
4. **Infrastructure** — DB, HTTP, third‑party gateways.

Use **dependency injection** (constructor, context, or hooks) rather than direct imports for swappable dependencies (e.g., logger, HTTP client).

---

## 4  Module Boundaries & Imports

- Export only what consumers need; group exports via barrel `index.ts` when useful.
- Respect existing path aliases (`@/…`) or configure them; avoid deep relative paths.
- Tag non‑public helpers with `/** @internal */`.

---

## 5  Data Fetching & Error Handling

- Centralise HTTP calls or other I/O in a dedicated client; keep UI components free of fetch logic except via hooks.
- Translate failures into typed error classes (`ApiError`, `NetworkError`, etc.) that extend a common base and retain `.cause`.
- For edge/runtime portability, depend on Web APIs (`fetch`, `URL`) over Node‑specific modules.

---

## 6  Documentation & Quality Gates

- Document every exported symbol with JSDoc (`@param`, `@returns`, `@throws`, examples).
- Enforce style, lint, and types via Husky + lint‑staged or similar pre‑commit hooks and CI.
- The build must stay _red_ until tests and type checks pass — do not mute or bypass tooling.

---

## 7  Testing Strategy

| Level | Goal                              | Typical Tooling                    |
| ----- | --------------------------------- | ---------------------------------- |
| Unit  | Verify smallest unit in isolation | Vitest / Jest (run in‑memory)      |
| Int   | Verify collaboration of units     | Vitest / Jest (mock at boundaries) |
| E2E   | Verify behaviour through UI/API   | Playwright / Cypress               |

_Mock external networks and side‑effects._ Aim for meaningful coverage; the percentage target may vary per repo.

---

## 8  Workflow & Automation

Provide or update `package.json` scripts so contributors can run:

1. `dev` — local development server
2. `type-check` — `tsc --noEmit`
3. `lint` — ESLint
4. `test` — unit/integration tests
5. `build` — production build

CI should execute them in that order. The exact commands may differ (e.g., `pnpm`, `yarn`, `npm`).

---

## 9  Next.js‑Specific Advice (apply where relevant)

- Use **App Router** (`/app`) and prefer **Server Components** unless client‑only libs force `'use client'`.
- Co‑locate route files (`page.tsx`, `layout.tsx`, etc.) for discoverability.
- Wrap heavy client‑side libraries in **dynamic imports** + `<Suspense>`.
- Only expose environment variables prefixed with `NEXT_PUBLIC_`.
- Keep static assets in `/public` and serve via `next/image` for optimisation.

If the repository uses another framework, translate these ideas to its idioms (e.g., Remix routes, Express endpoints, etc.).

---

## 10  LLM Copilot Self‑Checklist

1. **TDD first** — did I add/adjust failing tests _before_ code?
2. **Quality gates green** — do lint, type‑check, tests and build pass?
3. **Context respected** — did I read the whole file and stay consistent with surrounding code?
4. **Atomic commit** — does my change set address a single concern?
5. **Docs updated** — are public APIs documented and examples current?
6. **Bundle health** — did I avoid bloat and dead code for the client bundle?
7. **Security** — have I validated new dependencies and avoided secret leakage?

---

_Endeavour to leave the codebase healthier than you found it. Refactor mercilessly, guided by tests._
