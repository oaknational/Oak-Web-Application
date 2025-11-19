# Oak Authoring Starter – Simplification & Template Plan

Generated: 2025-11-19 (Codex CLI)

## 1. Objective

Create a streamlined starter application for new Oak tooling projects—optimised for authenticated curriculum **authoring** workflows—by distilling lessons from the current Oak Web Application (OWA) while upgrading every dependency to the latest stable versions (Next.js 16, Turbopack, pnpm, Node 22). The template must:

- Be app-router only, powered by Oak Components (Styled Components).
- Embed core integrations (Clerk, PostHog, Sentry) plus optional Sanity (copy), curriculum API client, and AI Gateway hook.
- Use Doppler for configuration and secrets, not ad-hoc env files.
- Provide best-in-class privacy, local structured persistence, and developer experience (Vitest, Storybook, linting, release automation).

## 2. Baseline Insights Drawn From OWA

- **Security & errors**: Centralised `OakError` catalog + error reporter toggling Bugsnag/Sentry; consent-aware logging; rate-limited APIs.
- **Data access**: Multiple service layers (Sanity, curriculum, educator API, HubSpot). Most logic lives under `src/node-lib/*` with zod schemas.
- **UI system**: Persona-specific component forests built on Oak Components with Shared contexts (analytics, search, menu). Styled-components theme wrappers in `src/styles`.
- **Config & build**: Custom env readers (`getBrowserConfig`, `getServerConfig`) + `oak-config/*.json` + fetchers; Next config ties to Vercel/Netlify; heavy scripts for sprite generation and static export.
- **Tooling**: npm + Jest + Storybook + Percy + Pa11y; mix of pages + app router; Node 18 baseline; Husky/commitlint; release via semantic-release.

These patterns inform what to keep, simplify, or replace in the starter.

## 3. Target Stack Snapshot

| Capability | Decision |
| --- | --- |
| Runtime & tooling | Node 22, pnpm workspaces (single package initially), Next.js 16 (app router only) with Turbopack dev server. |
| UI | Oak Components + Styled Components 6, shared Oak theme provider, MDX support for internal docs. |
| Auth & user state | Clerk 6+ with server components + middlewares; RBAC to separate developer/admin roles from author tenants. |
| Analytics & observability | PostHog JS/Node SDKs, Sentry (browser + server) fed by official OpenTelemetry SDKs + Pino logging, with Vercel Observability Plus providing platform metrics. All integrations must be optional and adapter-backed so the app still boots with degraded functionality when credentials are absent. |
| Content sources | Sanity GraphQL client for marketing copy (optional module). |
| Curriculum service | Encapsulated REST/GraphQL client module with dependency injection to enable swapping future authoring APIs. |
| AI (optional) | Feature-flagged AI Gateway client with parameterised providers; disabled by default. |
| Config | Doppler CLI + `doppler.yaml` per environment feeds build/runtime envs; no custom config fetcher. |
| Storage | Local structured persistence (IndexedDB via Dexie or custom Zod-backed localStorage module) with autosave + optimistic sync; server persistence assumed via future API. |
| Testing | Vitest + React Testing Library, Playwright for e2e, Storybook (latest) with test-runner. |
| QA | Pa11y (accessibility), Percy (visual) re-enabled, but templated. |

## 4. Architecture Blueprint

### 4.1 High-Level Modules

1. **App Shell**: `src/app/(authenticated)/…` for curriculum authoring surfaces; global layout wires Clerk, OakThemeProvider, PHProvider, ConsentProvider, error boundaries, Suspense fallbacks.
2. **Design System Layer**: Imports Oak Components + overrides; custom tokens stored under `src/styles/theme`.
3. **Domain Modules**:
   - `authoring/workspace`: flows for creating/editing curriculum entities.
   - `authoring/review`: approval workflows, audit logs.
   - `shared/data`: service interfaces (CurriculumService, DraftStorage, SanityContent, AiAssistant).
   - `shared/state`: React contexts (Analytics, FeatureFlags, DraftPersistence, Toasts).
4. **Infrastructure & Config**:
   - `config/doppler.ts`: typed env loader using Doppler CLI injection, minimal wrappers (zod parse).
   - `lib/observability`: Sentry client/server configs, OpenTelemetry instrumentation (`instrumentation.ts`, OTLP exporters), Vercel Observability Plus hooks, and structured logging adapters (Pino + neverthrow helpers). `lib/auth`: Clerk helpers; `lib/analytics`: PostHog wrappers.
5. **Testing & Tooling**: `vitest.config.ts`, `playwright.config.ts`, `storybook/`, `pnpm-workspace.yaml`, `.nvmrc` pinned to Node 22.

### 4.2 API Encapsulation

- Define interfaces, e.g.:

  ```ts
  export interface CurriculumService {
    getProgrammes(ctx: AuthContext): Promise<Programme[]>;
    createDraftLesson(input: LessonDraft): Promise<LessonDraftId>;
    // …
  }
  ```

- Provide `CurriculumApiAdapter` backed by the existing OWA GraphQL SDK (generated via codegen). Swap later by registering a different adapter.
- Publish adapters via dependency injection container or simple factory using Doppler-provided `CURRICULUM_API_MODE`.

### 4.3 Optional AI Gateway

- `lib/ai-gateway/client.ts` exports `callAi()` only when `AI_GATEWAY_ENABLED=true`.
- Wrap with feature flag + guardrails (rate limiting, redaction). Provide stub implementation returning empty suggestions in template to keep footprints optional.

### 4.4 Local Structured Persistence

- Requirements: autosave, offline resilience, privacy (encrypted at rest on device), conflict resolution when reconnecting to API.
- Proposal:
  - Use IndexedDB via Dexie or `idb` library for structured schema (`drafts`, `assets`, `metadata` tables).
  - Wrap data access in `DraftStorage` service (zod schemas for writes/reads).
  - Add background sync worker (Next route handler + Service Worker or periodic `setInterval`) to push drafts to API once backend ready.
  - Provide session-level encryption key derived from Clerk session (per-user) to keep local data unreadable if device is shared.

## 5. Privacy & Access Controls

1. **Environment segmentation**:  
   - Doppler projects per environment (dev, staging, prod, “sensitive prod”).  
   - Developers only access non-sensitive Doppler configs; production configs delivered via deployment tokens.
2. **Data classification**:  
   - Tag authoring data as “confidential”; instrumentation (PostHog/Sentry) must scrub payloads or hash content IDs.  
   - Provide redaction utilities to remove draft text before logging/analytics.
3. **RBAC**:  
   - Clerk roles: `developer`, `author`, `reviewer`, `admin`.  
   - Middleware ensures developers cannot impersonate authors nor fetch their drafts unless explicitly granted.
4. **Tenant isolation**:  
   - Multi-tenant ID propagated through service layer (context includes `tenantId`, `userId`, `role`).  
   - Curriculum API adapter must pass tenant scopes (even if mocked for now).
5. **Secure local data**:  
   - Encrypt drafts in IndexedDB with per-user key.  
   - Provide “panic clear” command to purge local storage if device compromised.
6. **Audit logging**:  
   - Wrap all authoring actions through an `ActivityLogger` writing structured events to PostHog + future API.
7. **Data lifecycle**:  
   - Once server persistence exists, expose draft export/delete endpoints with clear retention windows (default 90 days for inactive drafts).  
   - Keep immutable audit logs but purge content snapshots according to privacy policy.  
   - Provide automated tooling to fulfill right-to-erasure requests across local caches and remote storage.

## 6. Config & Secrets with Doppler

- Replace `getBrowserConfig`/`getServerConfig` with:

  ```ts
  import { createEnv } from "@t3-oss/env-nextjs"; // or custom zod parser
  export const env = createEnv({
    server: { CURRICULUM_API_URL: z.string().url(), … },
    client: { NEXT_PUBLIC_POSTHOG_KEY: z.string(), … },
  });
  ```

- Doppler CLI injects envs during `pnpm dev` / `pnpm build`; store config metadata under `/config/doppler/README.md`.
- Document onboarding: install Doppler, run `doppler setup`, use service tokens in CI/CD.

## 7. Tooling Modernisation Plan

| Area | Plan |
| --- | --- |
| Package manager | Convert repo to pnpm (`pnpm-workspace.yaml`, lockfile). |
| Build/dev | Enable Turbopack for `pnpm dev`; configure `next.config.mjs` for Next 16 features only. |
| Testing | Introduce Vitest with coverage + `@vitest/ui`; configure environment per package (dom/node). |
| Storybook | Latest Storybook 8+ with Vite builder to align with Turbopack dev feel; include Chromatic/Percy hooks. |
| Linting | ESLint flat config + TypeScript ESLint 8, Stylelint latest, Prettier 3. |
| Accessibility | Pa11y + axe Vitest matcher; integrate into CI as required gate. |
| Release | Semantic-release or Changesets; include GitHub workflows for lint/test/build/deploy. |
| Node version | `.nvmrc` + `.tool-versions` pinned to 22.x; CI runtime uses same. |

### 7.1 Type discipline, TDD, and quality gates

- **TypeScript configuration**: keep `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`, `noPropertyAccessFromIndexSignature`, and `noImplicitReturns` enabled. Never relax these per-file.
- **Escape-hatch policy**: lint errors for `any`, `unknown` without narrowing, non-null assertions, or `as` casts except in infrastructure adapters with documented justification. Add automated codemods/static checks to flag violations in PRs.
- **Results-only domain logic**: mandate `Result<T, E>` / `ResultAsync<T, E>` return types for all service/domain functions; provide helpers that convert thrown errors into domain error unions.
- **Test-Driven Development**: codify the workflow (write failing test → minimal code → pass → refactor) in CONTRIBUTING.md; Husky pre-commit ensures that source changes have corresponding test updates unless `SKIP_TDD_CHECK=1` is set.
- **Quality gates**: CI must run `pnpm format:check`, `pnpm lint`, `pnpm type-check`, `pnpm test:ci`, and `pnpm build`. Pipelines fail fast on the first red gate; no merges without full green status.
- **Static analysis & security**: integrate ESLint security rules/Biome, dependency scanning (`pnpm audit-ci`, Snyk/Fossa), and `madge` cycle detection into CI. Block releases if high/critical issues remain unresolved.

## 8. Observability & Operational Excellence

### 8.1 Telemetry stack

- **Sentry as primary plane**: capture errors, performance spans, session replay, structured logs, and RED metrics via `@sentry/nextjs` on both client and server. Treat Sentry as the canonical debugging surface.
- **OpenTelemetry-first instrumentation**: ship `instrumentation.ts` plus `lib/otel` helpers that initialise the official `@opentelemetry/sdk-node`, `@opentelemetry/sdk-metrics`, and browser SDKs. All traces/metrics/logs flow through OTLP exporters so we can dual-stream to other vendors later if needed.
- **Structured logging**: central `lib/logger/pino.ts` pipes Node runtime logs to Pino, which forwards to Sentry (via `pinoIntegration`) and any additional sinks (Vector, Datadog) in production.
- **Vercel Observability Plus**: enable at the project level to surface platform metrics (edge/network errors, function cold starts, cache hit rates) and forward them into Sentry dashboards alongside application telemetry.
- **Graceful degradation**: every integration (Sentry, PostHog, Sanity, Curriculum API, AI Gateway) must be accessed through adapters that detect missing credentials/config and log a clear warning while allowing the app to start in reduced mode. Non-essential tooling should no-op with prominent `ActivityLogger` notices so engineers know instrumentation is disabled.

### 8.2 Error handling & logging model

- Adopt the neverthrow-based domain error pattern from OWA, but codify it in `@/domain/errors` with exhaustive TypeScript unions.
- `lib/error-reporting.ts` maps domain errors to HTTP responses, logs via Pino, and raises Sentry issues only for actionable classes (unknown, validation, system faults). All logging helpers enforce redaction hooks to strip draft content and PII.
- Domain logic must **fail fast with helpful error messages**: prefer rejecting early (with `Result.err`) over silent fallbacks, ensuring engineers discover configuration/data issues immediately.

### 8.3 Metrics, tracing, and health signals

- Define RED metrics (`draft.save.requests`, `draft.save.errors`, `draft.save.duration`) plus Core Web Vitals, emitting them through OTEL instruments and exporting to Sentry Metrics or Grafana Cloud.
- Provide `pnpm dev:otel` to boot a local OTLP collector so devs see spans/metrics in Sentry while developing.
- Configure Checkly/Pingdom synthetic monitors for core surfaces (author login, draft save, AI assist) and keep them linked to PagerDuty/Opsgenie rotations.

### 8.4 Alerting, SLOs, and runbooks

- Publish SLOs per critical path (e.g., “99th percentile draft save <2s, <0.5% failure rate”) and back them with Sentry/Vercel Observability alerts.
- Maintain runbooks that enumerate mitigation levers (disable AI feature flag, reroute to cached curriculum data, purge stuck drafts) and link them from alert payloads.

### 8.5 Developer experience hooks

- Extend `pnpm dev:stack` to start Next.js (Turbopack), Doppler, MSW mocks, and the OTEL collector so telemetry parity exists locally.
- Document observability onboarding (Sentry project access, Vercel Observability dashboards, OTEL exporter config) alongside privacy expectations (what data may be logged, how to redact).

## 9. Simplification Strategy from OWA

1. **Drop marketing/pupil flows**: remove `src/pages`, marketing components, SEO extras, HubSpot forms, CMS-specific logic not needed for authoring.
2. **Retain/port**:
   - Error handling pattern (OakError) but slim down codes to authoring domain.
   - Local storage utilities (`src/utils/localstorage.ts`) as inspiration for DraftStorage (move to IndexedDB).
   - Consent + analytics wrappers, but modernise to PostHog-only (Avo optional).
3. **App router migration**:
   - Identify any components still depending on `next/router` and rewrite using `next/navigation`.
   - Remove `_document`, `_app`, legacy API routes; re-create API handlers under `src/app/api`.
4. **Assets pipeline**:
   - Replace sprite-generation scripts with Oak Components asset pipeline; static assets via Next Image / Cloudinary only as needed.
5. **Config clean-up**:
   - Delete `oak-config/`, config fetch scripts, Netlify-specific config.  
   - Standardise on Vercel + Doppler.
6. **Dev ergonomics**:
   - Build CLI scaffolding (`pnpm create:module`) to generate feature folders with tests/stories.

## 10. Implementation Phases

1. **Scoping & repo split**
   - Clone OWA, remove irrelevant directories, convert to pnpm, bump Node/Next.
   - Establish Doppler project + baseline env spec.
2. **Core platform**
   - Implement app router layout with Clerk/PostHog/Sentry wiring.
   - Port Oak theme + core components; set up DraftStorage service + basic authoring page skeleton.
3. **Service layer encapsulation**
   - Build CurriculumService interface + adapter using existing SDK.
   - Add Sanity + AI Gateway optional modules (feature-flagged).
4. **Privacy & persistence**
   - Add RBAC middleware, encryption helpers, audit logging.
   - Implement IndexedDB persistence + autosave flows.
5. **Tooling & QA**
   - Configure Vitest, Playwright, Storybook, Pa11y, Percy.
   - Add GitHub workflows (lint/test/build/deploy), semantic-release or Changesets.
6. **Hardening**
   - Run security review (secrets scanning, dependency audit, threat model).
   - Document developer onboarding, privacy constraints, env setup, extension guides.
   - Execute disaster-recovery drills (restore from backups, simulate config loss) and incident response tabletop exercises; capture learnings in runbooks.

## 11. Open Questions / Follow-Up Research

1. **Future authoring API spec** – requirements for the “more appropriate API” will influence adapter design (streaming, real-time collab, presence?). Need early schema draft.
2. **Local encryption strategy** – Should we integrate WebCrypto directly, or rely on a vetted library for IndexedDB encryption?
3. **AI usage** – Clarify likely workloads (text generation vs tagging) to size rate limiting and consent flows.
4. **Authoring UX patterns** – Should starter include collaborative editing scaffolding (websocket infra) or keep scope to single-author drafts?
5. **Data residency/privacy** – Any geolocation constraints for storing drafts/telemetry (e.g., UK-only)? Impacts Vercel region + Doppler data residency.

---

## 12. Best-Practice Notes on Open Questions

### 12.1 Future Authoring API Specification

- **Contract-first design**: publish an OpenAPI/GraphQL schema up front, run codegen for clients, and enforce breaking-change checks in CI.
- **Domain-driven boundaries**: modularise capabilities (e.g., Programme, Lesson Draft, Review) behind separate scopes/services to make least-privilege enforcement simpler.
- **Versioning**: prefer additive GraphQL schemas or REST resources with explicit version headers; ship deprecation policy + automated compatibility tests.
- **AuthZ**: propagate tenant + role claims (Clerk-issued JWT or service token) and gate endpoints server-side via OPA or Hasura policies; log every mutation with immutable audit events.
- **Transport choices**: stick with HTTPS/JSON for CRUD, layer WebSockets or server-sent events only where collaboration demands it; document SLAs per route.

### 12.2 Local Encryption Strategy

- **Key derivation**: derive per-user, per-device encryption keys using WebCrypto SubtleCrypto (e.g., PBKDF2 over Clerk session key + device salt) and cache them in memory, not storage.
- **Algorithms**: AES-GCM for bulk draft blobs, with random IV per record; store IV alongside ciphertext in IndexedDB.
- **Metadata separation**: keep non-sensitive metadata (IDs, timestamps) outside ciphertext for querying; encrypt only content payloads.
- **Zero-knowledge mode**: expose “secure workspace” toggle that never syncs plaintext to logs/analytics; only hashed identifiers leave the browser.
- **Key rotation & purge**: implement hooks to rotate keys when a user resets credentials and to securely wipe IndexedDB on logout or panic action.

### 12.3 AI Usage Patterns

- **Data minimisation**: send only the text spans required for the AI task, redact PII and unreleased content unless the user opts in.
- **Prompt repository**: store prompts/templates in version-controlled JSON with peer review; enforce output schemas via zod validators.
- **Guardrails**: wrap AI calls with rate limiting, toxicity/PII detectors, and human-in-the-loop approval for anything that ships externally.
- **Evaluation**: run regression suites (golden prompts vs. expected responses) whenever upgrading models/providers; log quality scores to PostHog dashboards.
- **Consent & visibility**: clearly flag AI-generated sections in the UI and keep a provenance trail for editors/reviewers.

### 12.4 Authoring UX & Collaboration

- **Autosave-first UX**: optimistic UI with immediate local commits and background sync status indicators (success/warning/failure).
- **Collaboration**: adopt CRDT or OT library (e.g., Yjs, Automerge) if simultaneous editing is expected; otherwise stick to single-author locks plus activity feeds.
- **Presence & review**: provide lightweight presence indicators (who viewed last, who is editing) via server-sent events or PostHog cohorts; expose review states with audit trail.
- **Accessibility & keyboarding**: ensure authoring canvases follow WCAG 2.2 AA, provide hotkeys, and support screen readers despite rich content.

### 12.5 Data Residency & Hosting (UK-only assumption)

- **Region pinning**: deploy Vercel workloads to `lhr1` (London) and restrict remote services (PostHog EU, Sentry EU, Sanity EU) to UK/EU storage.
- **Secrets & config**: host Doppler in EU org, issue environment-specific service tokens with RBAC to prevent cross-region leakage.
- **Backups**: encrypt backups at rest and store them in UK/EU regions; document retention + deletion policies for drafts.
- **Monitoring**: run privacy posture audits (Cloudflare Radar, AWS CloudTrail equivalents) to confirm no traffic leaves allowed regions.
- **Secure SDLC**: conduct recurring threat-model sessions (per major feature), enforce dependency scanning (`pnpm audit`, Snyk/Fossa), and integrate SAST (ESLint security rules, Biome) into CI. Document remediation SLAs for vulnerabilities.
- **Developer onboarding & DX**: publish a step-by-step onboarding guide (install Volta/Node 22, pnpm, Doppler, run `pnpm dev:stack`, configure Sentry/PostHog preview keys). Include `pnpm doctor` script to validate environment health.
- **Third-party governance**: require security/privacy review for every new external vendor (AI gateway, analytics, storage). Adapters must surface health status so ops can swap providers without touching domain logic.

## 13. Release Tooling Options

### Semantic-release vs. Changesets

| Aspect | semantic-release | Changesets |
| --- | --- | --- |
| **Philosophy** | Fully automated releases derived from commit messages (Conventional Commits). | Author-maintained change files checked into repo; releases happen when you run `changeset version/release`. |
| **Monorepo support** | Works but needs config/plugins; less intuitive for publishing multiple packages. | Built for monorepos—per-package change files and PR previews are first-class. |
| **Human review** | Minimal—once merged, release happens automatically on CI. | Changesets live in PRs, enabling discussion before release; promotes deliberate version bumps. |
| **Prereleases** | Supported but more complex; relies on channels / custom config. | Simplified prerelease mode toggles; easy to promote packages incrementally. |
| **Changelog quality** | Generated from commit messages; quality tied to developer discipline. | Developers author prose summaries per change, producing richer changelogs. |
| **Adoption effort** | Requires strict Conventional Commit workflow, automation trust, and fewer manual steps. | Adds a manual step (`pnpm changeset`) but tolerates any commit style. |
| **Ideal use case** | Single package or tightly coupled repo with high commit hygiene and desire for “hands-off” releasing. | Multi-package starter kit where you want curated change notes, manual gating, and occasional batch releases. |

**Recommendation**: Given the template will likely evolve into a small monorepo (core app + shared packages) and we want deliberate, privacy-conscious releases, Changesets offers better ergonomics and human oversight. Semantic-release remains an option if we later prefer full automation and can guarantee Conventional Commits adherence.

---

_Prepared for future planning discussions; see accompanying migration checklist for implementation sequencing._
