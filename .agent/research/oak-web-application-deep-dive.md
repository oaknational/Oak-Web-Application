# Oak Web Application – Deep Dive

_Generated: 2025-11-19 (Codex CLI)_

## 1. Purpose & Product Scope
- The site (`README.md`) is the public-facing Oak National Academy web experience delivering curriculum browsing, lesson downloads, and newer AI-assisted teacher tools. It serves both teacher- and pupil-facing journeys, plus marketing, onboarding, and campaign pages.
- The platform must statically prebuild tens of thousands of routes yet support incremental updates. Next.js is configured for ISR with fallback blocking for dynamic lesson/programme paths (`src/node-lib/isr/index.ts`).
- Documentation under `docs/` (testing, SEO, imagery) plus `src/errors/README.md` and persona-specific component READMEs clarify higher-level decisions.

## 2. Tech Stack & Tooling Snapshot
### Core frameworks & libraries
- **Next.js 13** using both `src/app` (app router) and legacy `src/pages` folders. SSR + SSG + API routes coexist.
- **TypeScript** with strict settings (`tsconfig.json`: `strict`, `noUncheckedIndexedAccess`, `noImplicitAny`, path alias `@/*`).
- **styled-components** and Oak’s custom theme wrapper (`src/styles/oakThemeApp.ts`) for design tokens, plus MDX sections for documentation content.
- **React Hook Form**, **Zod**, **SWR**, **Tiptap**, **PostHog**, **Clerk**, **OpenAI client**, **@upstash/redis/ratelimit**, **@google-cloud/firestore/storage**, **Mux**, **HubSpot API**, `@oaknational/*` component packages, etc. (see `package.json` for the full dependency set).

### Scripts & automation
- `package.json` scripts span build prep (`generate-sprites`, `build:prep`), Next dev/build/export, linting (`lint`, `lint:styles`), formatting, Jest test variants (`test`, `test:ci`, domain-specific configs), storybook, Percy, Pa11y, Madge, environment config pull/push, GraphQL codegen, and semantic release.
- Husky hooks (`prepare` script) enforce Prettier, lint, tests, and commit message validation (`commitlint.config.js`). `.lintstagedrc.js` (not shown above) wires formatting/linting into staged files.

## 3. Repository Layout Highlights
| Path | Purpose |
| --- | --- |
| `src/` | Application code. Key sub-folders: `app` (new Next app router routes/providers), `pages` (legacy routes + API), `components` (persona-specific UI), `browser-lib` (client utilities: config, analytics, SEO, consent, PostHog, Gleap, cookie handling), `common-lib` (shared CMS/types/URLs/forms), `context` (React contexts for analytics, search, menus, toasts), `node-lib` (server-side helpers: curriculum API GraphQL clients, CMS resolvers, hubspot, educator API, Firestore, ISR helpers, PostHog flag accessing, etc.), `pages-helpers` (curriculum doc generation, static path utilities), `styles` (global + theme), `utils` (feature flags, rate limiter, slug helpers, doc builders, prompt builder). |
| `scripts/` | Build-time helpers: config fetch/push (`scripts/build/fetch_config`), secret writing, image sprite generation (`scripts/build/image_data/all.sh`), release helpers, etc. |
| `oak-config/` | Example config JSON files referenced through `OAK_CONFIG_LOCATION`. |
| `docs/` | Process guides (testing lifecycle `docs/testing.md`, SEO `docs/seo.md`, image workflows). |
| `infrastructure/` | Terraform stubs for Google Cloud Storage buckets used for uploaded lesson videos (`infrastructure/README.md`). |
| `.agent/` | Internal research/planning artefacts (current doc saved here). |
| CI/CD config | `.github/`, `netlify/`, `vercel.json`, `release.config.js`, `pa11yci.config.js`, `percy.config.js`, `sonar-project.properties`. |

## 4. Configuration & Build System
- **Environment config sourcing**: `scripts/build/fetch_config/index.ts` reads either a local `oak-config/*.json` or remote HTTP endpoint based on `OAK_CONFIG_LOCATION`, returning strongly typed `OakConfig`. Non-secret values are injected at build time; secrets rely on a separate mechanism.
- **Runtime config accessors**: `src/browser-lib/getBrowserConfig.ts` and `src/node-lib/getServerConfig.ts` enumerate every env var (with required flags, defaults, allow-listed values) and enforce availability across browser vs server contexts. Both functions parse values, guard against `"undefined"`, and throw early if required variables are missing.
- **Next config**: `next.config.ts` layers bundle analyzer toggles, Sentry/Bugsnag webpack plugins, remote image host allow-lists, PostHog reverse proxy rewrites, custom redirects/rewrites, output tracing excludes, and automatic `.env.local` mutation to include `SITEMAP_BASE_URL`. Build phase detection drives release stage logic + version stamping.
- **Image/data pipeline**: `scripts/build/image_data/all.sh` executes node scripts to generate favicons, inline sprite sheets, social sharing images, and Sanity asset manifests prior to build or Storybook generation.
- **Storybook & Percy**: `storybook` scripts run with SWC compiler; Percy config (`percy.config.js`) enforces Vercel bypass headers and custom selectors to hide consent/analytics overlays.
- **Accessibility**: Pa11y config (`pa11yci.config.js`) populates URLs via `src/common-lib/urls/getDeploymentTestUrls.ts`, requires Vercel bypass tokens when hitting preview deployments, and hides consent overlays while ignoring known false positives (contrast, video captions, list semantics).
- **Quality gates**: `.eslintrc.js` enforces import ordering, React hooks rules, disallows unused vars, and applies TypeScript-specific linting. `stylelint` & `prettier` configs complement formatting. `tsconfig.json` runs in strict mode with incremental builds.
- **Testing harness**: Jest base config (`jest.base.config.js`) pulls coverage across `src`, extends Next/Jest config, and enforces module aliasing. `jest.setup.js` mocks global APIs, forbids console usage unless `TEST_ALLOW_LOGGING=1`, stubs Bugsnag/Sentry/PostHog/Clerk, and enforces deterministic IDs/intersection observers.
- **Coverage & static analysis**: `sonar-project.properties` wires coverage files, excludes generated/fixture files, and documents known gaps (e.g., blog pages, AI prototypes). Semantic release pipeline updates `CHANGE_LOG.md` and Sonar project version automatically (`release.config.js`).

## 5. Application Architecture
### Routing & rendering
- Dual routing means new experimental surfaces (e.g., beta timetabling) live in `src/app`, while the bulk of marketing, teachers, pupils, legal, API endpoints, and sitemap routes remain under `src/pages`. This allows gradual migration without destabilizing existing pages.
- `src/node-lib/getPageProps.ts` wraps `getStaticProps`/`getServerSideProps` to initialize Bugsnag/Sentry once per request, capture errors with contextual metadata, translate `OakError` instances with 404 codes into Next’s `notFound`, and decorate responses with ISR settings via `decorateWithIsr`.
- Incremental static regeneration is centralized in `src/node-lib/isr/index.ts`, which toggles revalidation seconds (from config), exposes helpers for fallback blocking and sitemap generation, and supports disabling ISR entirely via `DISABLE_ISR`.

### Providers, middleware & feature flags
- `src/app/layout.tsx` composes the root HTML shell: Lexend font, global styles, Styled Components registry, PostHog provider (`src/app/providers.tsx`), Oak theme provider, Consent client, and Clerk provider (with custom copy + appearance). This layout only applies to app-router routes for now.
- Middleware (`src/middleware.ts`) runs Clerk’s auth middleware only for `/api|/trpc` to minimize latency on standard pages.
- Feature flags leverage PostHog’s feature flag API (`src/utils/featureFlags.ts` + `src/node-lib/posthog/getFeatureFlag.ts`). Server components call `useFeatureFlag` to fetch typed flag values keyed by the user’s PostHog ID derived from cookies.
- Example: the new timetabling routes in `src/app/(beta)/timetabling/[subjectPhaseSlug]/layout.tsx` gate rendering on `adopt-timetabling-proto` and provide a mock analytics provider because the main analytics context is still tied to `next/router`.

### UI composition & styling
- Components are grouped by persona: `src/components/TeacherComponents`, `PupilComponents`, `GenericPagesComponents`, `SharedComponents`, etc. Each folder contains many small, SSR-friendly React components plus helpers, hooks, and schemas (e.g., `TeacherComponents/downloadAndShare.schema.ts`).
- MDX is used for certain content modules (e.g., `src/components/introduction.mdx`).
- The `OakThemeProvider` (`src/styles/oakThemeApp.ts` + `src/styles/theme/*`) wraps components with brand tokens. Additional helpers for transitions, resets, ellipsis handling, etc., live in `src/styles`.
- React contexts under `src/context` manage cross-cutting concerns: analytics (`AnalyticsProvider`), menu state, search, toast notifications, and save-count updates. These contexts often have associated hooks (`src/context/Search/useSearch.ts`, etc.) and SWR fetchers.
- Hooks under `src/hooks/` (e.g., `useFetch.ts`, `useCheckUserMetadata.ts`, `useRequireOnboarding.ts`) codify common SWR + Clerk + analytics patterns.

### Utilities & helpers
- `src/common-lib/urls/urls.ts` defines a strongly typed registry of every first-party route using `path-to-regexp`, enabling compile-time validation, consistent analytics naming, and safe redirection logic.
- `src/utils/` houses helpers for feature flags, rate limiting, slug manipulation, doc generation (Docx/XLSX), Cloudinary URLs, Google Cloud storage access, prompt building, etc. Many have paired unit tests.
- `src/pages-helpers/curriculum/{docx,xlsx}` build resources for downloads by stitching together zipped DOCX templates, multi-tab spreadsheets, and metadata aligning with teacher needs.

## 6. Data & Integration Layer
### Content & curriculum APIs
- **Sanity CMS**: `src/node-lib/cms/sanity-client/index.ts` wraps GraphQL queries generated under `src/node-lib/sanity-graphql`, running them through Zod schemas from `src/common-lib/cms-types`. Helpers resolve references (including HubSpot forms), proxy assets through Oak’s CDN (`getProxiedSanityAssetUrl.ts`), and fuse child/parent documents for composite pages.
- **Curriculum API 2023**: `src/node-lib/curriculum-api-2023/index.ts` wires dozens of GraphQL queries (lesson listings/overview/downloads, programmes, specialist flows, sitemap data, canonical redirects, beta media clips) using a generated SDK plus Zod parsing for every response. Utility helpers convert snake_case payloads, enforce search schemas, and expose typed key stage data.
- **Educator API**: `src/node-lib/educator-api/index.ts` instantiates a GraphQL client against Hasura using either Clerk-issued tokens (`getAuthenticatedEducatorApi`) or admin headers for webhooks (`getWebhookEducatorApi`).

### Forms & CRM
- **HubSpot**: `src/node-lib/hubspot-forms/` fetches form definitions via a private app token (configured via `getServerConfig`), transforms them, and generates Zod schemas (`src/common-lib/forms/formToZod.ts`). `hubspot-forms.md` documents dependent-field handling and progressive field roadmap. CMS documents embed hubspot references that are dereferenced server-side before rendering.

### Search & AI
- Classical search flows live in `src/context/Search/*`, with helpers for parsing query parameters, building search hit objects, deduping filters, etc. `src/context/Search/search.schema.ts` and `.types.ts` codify key stage/lesson hit shapes.
- **AI search intent**: `src/context/Search/ai/callModel.ts` calls an OpenAI-compatible gateway (model `cerebras/qwen-3-32b`) using prompts built by `src/utils/promptBuilder.ts` and validates responses via Zod. `src/pages/api/search/intent/index.ts` orchestrates the flow: parse query (`common-lib/schemas/search-intent`), attempt deterministic PF matches (`context/Search/suggestions/*`), fall back to AI if enabled, enforce Upstash rate limits (`src/utils/rateLimiter/rateLimiter.ts`), and set Cloudflare CDN cache headers for AI responses.

### Media & downloads
- Mux signed tokens are generated via API route `src/pages/api/video/signed-url/index.ts`, supporting both 2020 and 2023 signing keys and multiple asset types.
- Curriculum downloads rely on doc builders under `src/pages-helpers/curriculum/docx` and `xlsx`, plus `src/utils/gCloudStorage.ts` for retrieving generated files from Google Cloud Storage.
- `scripts/build/image_data/*` ensures sprite sheets and inline assets stay in sync with component usage.

### Data stores & infra services
- **Firestore**: `src/node-lib/firestore/getPupilFirestore.ts` uses Vercel’s workload identity federation (`@vercel/functions/oidc`) to mint GCP access tokens dynamically, with emulator support for local dev. This Firestore connection backs pupil save state / telemetry.
- **Google Cloud Storage**: `src/utils/gCloudStorage.ts` fetches arbitrary files by bucket/name pair; used by curriculum download builders and possibly doc exports.
- **Hubspot/Clerk metadata**: onboarding flows write custom metadata flags to Clerk to denote region authorization (`src/app/api/auth/onboarding/route.ts`, `src/app/api/update-region/route.ts`, `src/utils/onboarding/getRegion.ts`).

## 7. Analytics, Observability & Consent
- **Error reporting**: `src/common-lib/error-reporter/errorReporter.ts` unifies logging to Bugsnag or Sentry based on `NEXT_PUBLIC_SENTRY_ENABLED`. It wraps errors, respects OakError `shouldNotify` flags, honors cookie-consent settings before sending browser data, and deduplicates repeated reports.
- **OakError**: `src/errors/OakError.ts` enumerates canonical error codes with metadata including HTTP status and notification flags, enabling consistent handling across SSR, APIs, and analytics.
- **Analytics instrumentation**: `src/browser-lib/analytics/*` and `src/browser-lib/avo` integrate with Avo schemas plus PostHog. Analytics contexts (`src/context/Analytics/AnalyticsProvider.tsx`) expose typed capture helpers. Additional tools include Gleap feedback widgets (`src/browser-lib/gleap`) and PostHog aliasing hooks (`src/hooks/usePostHogAlias.ts`).
- **Consent & privacy**: `@oaknational/oak-consent-client` plus `src/browser-lib/cookie-consent/*` manage service-level consent, ensuring analytics/error reporting respect user choices. Pa11y/Percy configs explicitly hide consent overlays during testing.

## 8. Authentication, Authorization & User Metadata
- **Clerk integration**: App router layout wraps content in `ClerkProvider` with custom copy and a shared `/sign-in` route. Middleware scopes Clerk protection to API routes to reduce overhead.
- **Onboarding**: `src/app/api/auth/onboarding/route.ts` ensures authenticated users submit onboarding data (validated by `src/common-lib/schemas/onboarding.ts`), infers region from either request headers or dev overrides (`getRegion`), and saves derived metadata back to Clerk.
- **Region updates**: `src/app/api/update-region/route.ts` allows recomputing authorized regions, toggling `requiresGeoLocation`. `ALLOWED_REGIONS` is defined in `getRegion.ts`.
- **Clerk webhooks**: `src/app/api/webhooks/route.ts` verifies Svix signatures, proxies events to Hasura (user provisioning), tracks analytics events (sign-in/out, sign-up completions), and handles session lifecycle events. `src/utils/handleSessionCreatedEvent.ts` (and tests) manage additional metadata (e.g., `requiresGeoLocation` flags).

## 9. Testing & Quality Strategy
- **Unit & integration tests**: Jest is the primary harness with domain-specific configs for pages/components/storybook. Tests reside beside implementations except for `src/pages` due to Next limitations (`src/__tests__/pages` mirrors structure). Coverage is enforced by default; snapshots are separated from logic tests per `docs/testing.md`.
- **Strict console enforcement**: `jest.setup.js` converts any console log into a thrown error unless explicitly allowed, forcing clean test output.
- **SWR & hooks**: Custom hooks include dedicated tests within `src/hooks/*.test.ts[x]`.
- **Static analysis**: Madge scripts search for circular dependencies; `npm run madge:circulars` can graph issues. ESLint + Stylelint run in pre-commit.
- **Accessibility & visual regression**: Pa11y (`pa11yci.config.js`) and Percy (`percy.config.js`) run post-deployment via GitHub workflows triggered on successful deployment status events, as noted in `docs/testing.md`.
- **Storybook**: Components have stories consumed both by designers and Percy, enabling per-component inspection and a11y review.
- **Observations / potential gaps**:
  - `docs/testing.md` references `e2e_tests/browser/engineering`, but no such directory exists in the current tree—either omitted from the sandbox or stale documentation.
  - Several high-traffic legacy pages are excluded from Sonar coverage due to rapid prototyping; reintroducing tests there may be a future QA goal.

## 10. Search, AI, and Personalisation
- Search contexts coordinate local filtering state, analytics events, and SWR calls to `search-api`. `src/context/Search/useSearchFilters.ts` and supporting helpers enforce deterministic query serialization for analytics.
- `src/context/Search/suggestions` includes curated data (`oakCurriculumData.ts`) powering heuristics before invoking AI.
- AI gating:
  - Feature toggle `aiSearchEnabled` is read via `getServerConfig`.
  - Upstash rate limits (fixed window) guard expensive AI calls; `waitUntil` from `@vercel/functions` ensures background promise settlement.
  - Cloudflare caching headers (`Cloudflare-CDN-Cache-Control`) extend AI results for 30 days to reduce spend.
- PostHog feature flags also gate new beta pages (e.g., timetabling), enabling gradual rollout.

## 11. Infrastructure & Deployment
- Netlify manages preview/production builds for static deployment, while Vercel handles canonical deployments (per README). `next.config.ts` includes Vercel-specific rewrites/tunnels; release stage detection uses `VERCEL_ENV`/Netlify `CONTEXT`.
- Semantic Release (`release.config.js`) orchestrates version bumps, changelog updates, and GitHub releases when `main` updates.
- Terraform definitions under `infrastructure/` configure GCS buckets for uploaded lesson videos across environments (production/staging/demo). Developers duplicate `backend.tf.template` and rely on Terraform Cloud for workspace-specific variables.
- Firebase emulators are available for Firestore development (`npm run firestore`), and there’s a Netlify folder with functions/config for alternate hosting contexts.
- Reports (`npm run build` writes to `./reports/`) can be inspected via `npm run report:open`.

## 12. Risks, Constraints & Opportunities
1. **Dual routing complexity**: Maintaining both `src/app` and `src/pages` increases cognitive load and duplicates provider logic (mock analytics provider for app routes). A migration plan or shared abstraction for analytics/router dependencies would reduce drift.
2. **Configuration sprawl**: `getServerConfig` + `getBrowserConfig` enumerate dozens of env vars. Ensuring parity between actual deployment secrets and config definitions is critical. Consider schema validation (TODO noted in `scripts/build/fetch_config/README.md`).
3. **AI dependency management**: `callModel` currently pins `cerebras/qwen-3-32b` and relies on custom gateway credentials. Monitoring latency, cost, and fallback behavior (429 handling, service outages) should be part of SLOs.
4. **Observability split**: Error reporting toggles between Sentry and Bugsnag via config. Confirming both pipelines are configured per environment avoids silent drops.
5. **Region gating**: Authorization relies on `x-vercel-ip-country` headers. Make sure any upstream CDN/load balancer preserves this header, and document manual override paths beyond dev mode.
6. **HubSpot schema coverage**: Documentation admits progressive fields aren’t supported yet. If marketing enables them without engineering updates, forms will silently drop dependent inputs.
7. **Testing gaps**: Sonar exclusions + missing e2e folder indicates opportunity to expand coverage, especially around AI search and new Clerk onboarding flows.
8. **Analytics provider in app router**: Temporary mock contexts in `app/(beta)` routes mean analytics events may be lost for beta features until the provider is refactored to be router-agnostic.

## 13. Quick Reference Commands
```bash
# Dev server with sprite/env prep
npm run dev

# Generate environment-configured assets prior to build
npm run generate-sprites

# Run full Next build + sitemap generation
npm run build

# Type/lint/test suites
npm run type-check
npm run lint && npm run lint:styles
npm run test:ci

# Accessibility & visual regression (require BASE_URL/x-vercel header set)
npm run pa11y
npm run percy

# GraphQL codegen (examples)
npm run gql-codegen:curriculum-2023
npm run gql-codegen:sanity
```

---

_Prepared for: Oak National Academy — comprehensive codebase context for future engineering/research tasks._
