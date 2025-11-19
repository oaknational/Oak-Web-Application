# Oak Authoring Starter – Migration Plan

_Last updated: 2025-11-19_

## Overview
Transform the existing Oak Web Application (OWA) repository into a streamlined starter kit for authenticated curriculum-authoring tools. The plan follows Oak’s engineering principles (RULES.md) and preserves only the structures necessary for future authoring-focused apps. Work proceeds in staged waves so we can validate each change while keeping the repo functional.

## Phase 0 – Preparation & Audit
**Goal:** Understand current surface area and coupling before touching code.
1. **Create working branch**: `starter/migration` off `main`.
2. **Inventory routes/components**:
   - List every page under `src/pages` and `src/app`; mark those required for teacher authoring vs. marketing/pupil/legacy.
   - Capture dependencies per page (shared contexts, hooks, API clients) to anticipate cascading removals.
3. **Coupling analysis**:
   - Run `madge --circular` and document modules with cycles.
   - Identify shared state singletons (analytics, menus, search) that bleed across domains; note required decoupling.
4. **Tests & coverage baseline**:
   - Snapshot current Jest coverage, lint results, build size to compare after pruning.
5. **Stakeholder review**: (self) verify inventory + coupling notes; adjust scope if any critical authoring flows live inside marketing code.

**Done when**
- Inventory spreadsheet/doc lists every page/route with keep/remove decision and dependency notes.
- `madge` output archived in `.agent/research`.
- Baseline metrics (lint/test/build stats, bundle size) recorded.

## Phase 1 – Toolchain Modernisation
1. **pnpm adoption**: run `pnpm import`, commit `pnpm-lock.yaml`, update CI to use pnpm.
2. **Node/Turbo setup**: enforce Node 22 via `.nvmrc`/`.tool-versions`; update CI images; enable Turbopack default for `pnpm dev`.
3. **Vitest + Playwright**:
   - Install Vitest (unit) and configure `vitest.config.ts`.
   - Port representative Jest suites; leave Jest temporarily for untouched areas.
   - Add Playwright config for minimal e2e smoke tests.
4. **ESLint flat config**: replace `.eslintrc.js` with `.agent/research/eslint.config.ts` baseline (and move to repo root). Wire into `package.json` scripts.
5. **CI pipeline**: update GitHub Actions (or equivalent) to run `pnpm format:check`, `pnpm lint`, `pnpm type-check`, `pnpm test:ci`, `pnpm build`.
6. **Husky/TDD hooks**: ensure pre-commit runs formatting + lint; add custom hook that warns when source files change without tests unless `SKIP_TDD_CHECK=1`.

**Done when**
- CI pipeline runs pnpm-based gates (format, lint, type-check, test, build) and passes.
- Local `pnpm dev`, `pnpm lint`, `pnpm test:ci`, `pnpm build` succeed.
- ESLint flat config replaces legacy config; lint logs captured.
- Developer onboarding doc updated for pnpm/Node 22.

## Phase 2 – Routing Consolidation & Feature Pruning
1. **App router migration**:
   - Move essential authoring routes into `src/app` (beta timetabling, authoring dashboards, etc.).
   - Recreate API endpoints under `src/app/api`.
2. **Remove pages**: delete marketing, pupil, SEO landing, blog/legal flows, HubSpot/preview forms, net-new AI prototypes not part of authoring.
3. **Delete unused components**: remove React trees referenced solely by removed pages; clean up imports (use `rg`).
4. **Update Next config**: strip Netlify-specific toggles, old rewrites; ensure only required redirects remain.
5. **Docs + tests cleanup**: remove docs/tests tied to deleted features; adjust README to focus on starter goals.

**Done when**
- Deleted pages/components listed in PR; `rg` shows zero references.
- App router-only build (`pnpm build`) passes; lint shows no unused exports.
- README/docs mention only authoring surfaces.
- Playwright smoke covers retained routes.

## Phase 3 – Architecture Decoupling
1. **Context boundaries**:
   - Extract analytics context into adapter `lib/analytics` with PostHog default/stub fallback.
   - Remove cross-domain dependencies (e.g., teacher contexts referencing marketing components).
2. **Service interfaces**:
   - Define `CurriculumService`, `DraftStorage`, `AiAssistant`, `SanityContent` interfaces under `shared/data`.
   - Wrap existing implementations; add no-op adapters when envs missing.
3. **Error handling**:
   - Consolidate `OakError` codes to authoring-specific set.
   - Ensure `Result<T, E>` pipeline is enforced across service layer.
4. **Local persistence**:
   - Implement IndexedDB-based `DraftStorage` w/ encryption placeholder; integrate into key authoring flows.
5. **Feature flag & RBAC**:
   - Wire `useFeatureFlag` to PostHog adapter; ensure Clerk RBAC (author/reviewer/admin) gating for routes.

**Done when**
- New adapters/services have Vitest coverage.
- `madge` rerun shows elimination/reduction of prior cycles.
- Manual/automated checks confirm DraftStorage + RBAC flows function.

## Phase 4 – Observability & Config
1. **OpenTelemetry**:
   - Add `instrumentation.ts`, OTEL SDK setup, `pnpm dev:otel`.
   - Ensure traces/metrics/logs export to Sentry via OTLP; configure optional secondary exporters.
2. **Sentry & logging**:
   - Replace dual Bugsnag/Sentry setup with Sentry-only (client/server/edge). Use Pino + `pinoIntegration`.
   - Surface warnings when Sentry env vars absent but allow app start.
3. **Vercel Observability Plus**:
   - Document enabling steps and connect to project; ensure metrics forwarded to Sentry dashboards.
4. **Config via Doppler**:
   - Remove `getBrowserConfig`/`getServerConfig`.
   - Add `env.ts` using `@t3-oss/env-nextjs`; update README with Doppler setup instructions.
5. **Graceful degradation**:
   - For each adapter (Clerk, PostHog, Sanity, Curriculum API, AI gateway), add health checks and fallback logic when env vars missing or services unreachable. Emit structured warnings via ActivityLogger.

**Done when**
- Running `pnpm dev` without third-party keys logs clear warnings yet boot succeeds.
- OTEL spans/metrics visible in Sentry; evidence stored (screenshot/log).
- Vercel Observability Plus enabled; documentation updated.

## Phase 5 – Codebase Reduction & Validation
1. **Dependency pruning**: remove packages unused after pruning (HubSpot, WebdriverIO, E2E infra, etc.).
2. **Script cleanup**: delete unused scripts (sprite generators, config fetchers); keep only essential build steps.
3. **Docs refresh**: rewrite README + docs/testing/observability to describe the starter stack, TDD requirements, fail-fast philosophy, and adapter expectations.
4. **Template scaffolding**: add `pnpm create:module` (Plop/Turbo) to generate feature folders with tests/stories.
5. **Smoke tests**:
   - Run `pnpm dev` (with minimal env) to confirm app boots without third-party keys (shows warnings, limited functionality).
   - Execute `pnpm build`, `pnpm start` under same conditions.
6. **Benchmark**: capture final bundle size, lint/test stats, dependency count; compare against Phase 0 baseline to confirm reduction.

**Done when**
- `pnpm why` output confirms removal of legacy deps.
- README/docs rewritten to reflect starter scope; scaffolding command demoed.
- Bundle size/dependency metrics show ≥30% reduction vs Phase 0 baseline; recorded in `.agent/research`.
- CI passing without optional envs, demonstrating graceful degradation.

## Phase 6 – Finalisation
1. **ADR / change log**: publish architecture decision records summarising major cuts (routing, adapters, observability).
2. **Template tag**: tag repository (e.g., `starter-v0.1.0`) and document how to clone & start new apps from it.
3. **Archive legacy**: optionally tag last full OWA commit (`legacy-owa`) for reference.

**Done when**
- ADRs merged; release notes summarise migration.
- Tag `starter-v0.1.0` created; README explains bootstrap process.
- `legacy-owa` tag pushed.

## Risks & Mitigations
- **Hidden dependencies**: removing components may break retained flows. Mitigate via exhaustive `rg` searches and incremental PRs with CI/test validation.
- **Coupled contexts**: some React contexts may rely on removed modules; create adapter shims first before deletion.
- **Tooling churn**: migrating to pnpm/Vitest/ESLint 9 simultaneously could destabilise CI. Sequence changes (pnpm first, then lint/test) and keep Jest parallel until Vitest parity reached.

## Success Criteria
- Repo builds/runs with only core authoring flows, minimal dependencies, and optional adapters for external services.
- Quality gates (lint, type-check, test, build) pass with the new toolchain; TDD workflow enforced.
- Documentation clearly instructs future teams how to use the starter, configure Doppler/Sentry/PostHog/Clerk, and extend adapters.

Once Phase 0 sign-off is complete, we can begin executing the phases in order, merging each into `starter/migration` before final promotion to `main`.
