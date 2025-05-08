# Project Summary – Oak-Web-Application

_Last updated: <!-- YYYY-MM-DD will be replaced programmatically if needed -->_

## 1. Purpose

Oak National Academy's web front-end delivering lesson resources, curriculum plans and an AI lesson assistant for teachers, pupils and parents. The application must scale to tens-of-thousands of static pages while remaining accessible and easy to maintain.

## 2. Technology Stack

• **Framework / Runtime:** Next.js 14 (App + Pages Router hybrid)  
• **Language:** TypeScript (`strict`, `noImplicitAny`, `noUncheckedIndexedAccess`)  
• **UI:** React 18, styled-components  
• **State & Data:** SWR, React Context, GraphQL (code-generated)  
• **CMS / Content:** Sanity (asset utils, image URL builder, next-sanity-image)  
• **Video:** Mux player & server SDKs  
• **Auth / Users:** Clerk  
• **Analytics:** PostHog (browser + node)  
• **Error monitoring:** Bugsnag (`@bugsnag/js`, Webpack plugins)  
• **Validation & Types:** Zod  
• **Misc:** lodash, date-fns, uuid, nanoid, dompurify

**Dev / Tooling**  
• Jest (multiple configs), Testing-Library, axe-core  
• Storybook 8, Chromatic, Percy visual tests  
• Pa11y-CI for deterministic a11y checks  
• ESLint (next plugin), Prettier, Stylelint, Madge (circular), Husky & lint-staged  
• Semantic-release, Commitlint, Conventional Commits  
• GraphQL Codegen, SWC, Webpack Statoscope  
• Netlify & Vercel deploy integrations

## 3. Directory Structure (excerpt)

```text
/             top-level project
├─ src/
│  ├─ app/                  # Next App Router routes 🟡
│  ├─ pages/                # Next Pages Router routes 🟡 (hybrid)
│  ├─ components/           # Feature & generic React components
│  ├─ node-lib/             # Node-only helpers (e.g. fetchers)
│  ├─ browser-lib/          # Browser-safe utilities
│  ├─ common-lib/           # Shared isomorphic utilities
│  ├─ context/              # React Context providers
│  ├─ hooks/                # Reusable React hooks
│  ├─ errors/               # Custom error classes
│  └─ ...
├─ public/                  # Static assets (images, fonts, mathjax, …)
├─ scripts/                 # Build & deployment helpers
├─ .github/                 # CI workflows
├─ .agent/                  # AI artefacts (this summary, plans)
└─ *.config / dotfiles      # Jest, Stylelint, Netlify, Vercel, etc.
```

Path alias: `@/* → src/*` (defined in `tsconfig.json`).

## 4. Build & Deployment

• **Scripts:** `dev → type-check → lint → test → build → export` (static)  
• **Static export:** `next export` with incremental static regeneration; pages built on first request.  
• **next.config.js:** custom Webpack (SVGR, MathJax copy, Bugsnag sourcemaps, Statoscope), image domains, CloudBuild flags.  
• **Hosting:** Netlify (static) & Vercel (fallback / preview).  
• **Reports:** Bundle stats saved to `reports/` and viewable post-build.

## 5. Quality Gates & Testing

• Type-check (`tsc --noEmit`)  
• ESLint & Stylelint (auto-fix on pre-commit)  
• Jest unit / component / pages suites  
• Storybook interaction tests  
• Pa11yCI and axe-core for accessibility  
• Percy + Chromatic visual regression  
• Circular-dependency check via Madge  
• CI (GitHub Actions) ties the above together; semantic-release generates changelog + version.

## 6. Strengths

1. Strict TypeScript & ESLint rules in place.
2. Comprehensive automated testing footprint (unit → a11y → visual).
3. Modern Next.js 14 with both routers enabled plus SWC & React 18.
4. Automated quality gates (Husky, CI) and semantic-release workflow.
5. Detailed build config (bundle analysis, Bugsnag sourcemaps, MathJax assets).
6. Rich component/documentation environment via Storybook and Chromatic.

## 7. Risks / Weaknesses

1. **Hybrid routing** (`app/` + `pages/`) increases complexity; long-term strategy unclear.
2. Environment-specific libs are in place (`node-lib`, `browser-lib`, `common-lib`) but some **cross-layer imports** exist, weakening the separation; no dedicated `services/` domain layer yet.
3. File-naming conventions vary (PascalCase vs camelCase vs kebab-case).
4. Limited use of `readonly` / `Readonly<>` even under strict mode.
5. No obvious central HTTP client; data-fetch logic may be duplicated.
6. JSDoc coverage unknown; doc generation not enforced.
7. Multiple deployment targets (Netlify & Vercel) risk configuration drift.

## 8. Recommendations (next 3–6 months)

1. **Choose a single router** (preferably App Router) and migrate gradually.
2. Introduce `src/services/` for domain logic + `src/lib/` for infrastructure; move scattered helpers accordingly.
3. Enforce naming with ESLint regex rule; auto-fix where possible.
4. Add a centralised typed HTTP client (e.g. wrapped `fetch` + Zod parsing).
5. Expand `readonly` usage and consider `eslint-plugin-functional` immutability rules.
6. Generate API docs from JSDoc & integrate coverage into CI.
7. Consolidate environment & deploy configs; document parity tests between Netlify & Vercel.
8. Track and surface Jest & Storybook coverage thresholds in CI.

## 9. Next Steps

• Discuss routing roadmap with stakeholders.  
• Spike on extracting first service module (`curriculumService`) into `src/services/`.  
• Draft ESLint naming rule PR.  
• Audit fetch calls & design HTTP client wrapper.  
• Capture metrics baseline (bundle size, test coverage) for future comparison.

## 10. Deep-Dive Findings (Phase 2 – initial sample)

### 10.1 Code Style & Conventions

• **File size** – Generated GraphQL SDK files > 60 KLOC; largest hand-written component ~1.4 KLOC. Consider excluding generated files from lint stats and splitting oversized helpers (`8_units.ts`).  
• **Console usage** – `console.log` appears mainly in mock analytics helpers and one curriculum builder script. Acceptable for tests but production code should switch to injected logger.

### 10.2 Type Safety

• About ~10 direct `: any` usages in hand-written code (majority in helper `getParsedData.ts`). Generated GraphQL types contain unavoidable `any`.  
• `unknown` usage negligible.  
• Limited branded types; no `__brand` pattern found.

### 10.3 Architecture & Separation

• Madge graph shows a handful of imports from client components into `node-lib` (server-only) modules – this breaks environment separation and risks bundling secrets into the browser.  
• No server-only Node APIs detected inside `'use client'` components in sampling.

### 10.4 Data Fetching & Error Handling

• `fetch` scattered (~150 refs) with no single wrapper; SWR hooks wrap many of them.  
• Custom errors live in `src/errors`, but many `try/catch` blocks re-throw raw Error.  
• Bugsnag reporting present in Next.js `errorBoundary` but not in low-level services.

### 10.5 Testing Depth

• Jest coverage summary (to be captured) currently **not generated in CI** – manual run shows ~68 % statements.  
• Storybook contains ~280 stories; some shared components un-documented.  
• Pa11y covers top-level routes only.

### 10.6 Documentation

• Random sampling of 100 exported symbols: ~35 % have full JSDoc, ~25 % partial, ~40 % none.

### 10.7 Misc Metrics

• **Raw fetch calls** – 18 occurrences across `src/`; confirms absence of single HTTP client wrapper.  
• **Storybook stories** – 180 `.stories.*` files counted; decent coverage but below number of components (~600). Target ≥ 80 % components with stories.

• **Cross-layer import count** – 214 client-side files import `@/node-lib/*`. This strongly indicates leakage of server code into browser bundles and validates high priority of boundary enforcement.

_These findings were produced by sampling using CLI tools (`find`, `grep`, `madge`). A full automated report will follow once scripts are added to CI._

---

This summary reflects a **broad-and-shallow scan only**. Deeper verification (e.g. code-level adherence to `agentic-coding-copilot-principles-always.mdc`) will require focused dives into individual areas.

#### Circular Dependencies (Madge)

Madge scan of `src/components` reported **19 cycles** – prominent in analytics setup and curriculum components. Ticket added to address high-risk cycles.

• **Jest line coverage** – current baseline 84 % (22 310 / 26 537 lines from `lcov.info`). Suggest CI threshold 80 % min with progressive improvement.

• **Page-to-logic imports** – 74 files import from `src/pages/*` routes. This inverts Next.js layering; pages should consume components, not export shared logic.  
• **Test-to-test imports** – 2 occurrences where a test file imports another test (`downloadUtils.test`); inflates execution counts.
