# Plan: Produce a Broad-and-Shallow Project Summary for **Oak-Web-Application**

**Objective**: Quickly map the high-level architecture, tooling, and workflows of the repository so future deep-dives have a reliable starting point. Output the results to `.agent/project-summary.md`.

This plan purposefully avoids line-by-line code analysis; it focuses on configuration files, directory structure, and package manifests.

---

## Tasks

1. **Identify Project Purpose**  
   – Confirm repo name and short description (from `package.json` / `README.md`).

2. **Gather Technology Stack**  
   – Framework & Language (e.g. Next.js 14, TypeScript strict).  
   – Key runtime deps (React, styled-components, SWR, Sanity, Mux, Bugsnag, Zod, etc.).  
   – Key dev-tooling deps (Jest, Storybook, Playwright/Pa11y, ESLint, Prettier, Husky, Semantic-release, Netlify plugin, Vercel config).

3. **Map Directory Structure**  
   – Top-level dirs (`src/`, `public/`, `.github/`, `scripts/`, `.agent/`, etc.).  
   – Inside `src/`: presence of `app/` **and** `pages/` (hybrid routing), component location, shared libs.  
   – Path alias `@/* → src/*` (from `tsconfig.json`).

4. **Inspect Build & Runtime Configuration**  
   – `tsconfig.json` strictness flags.  
   – `next.config.js` custom webpack, Bugsnag, image domains, static-build flags.  
   – `package.json` scripts ordering; CI expectations.  
   – Deployment files: `netlify.toml`, `vercel.json`.

5. **Quality Gates & Testing**  
   – Linting (`next lint`, Stylelint).  
   – Type-check (`check-types`).  
   – Tests (unit, component, pages, Storybook).  
   – Accessibility (`pa11y`), visual regression (Percy).

6. **High-level Strengths & Risks**  
   – Note areas already aligned with best-practice rule `agentic-coding-copilot-principles-always.mdc`.  
   – Flag obvious gaps (hybrid router ambiguity, scattered utils, inconsistent naming, limited readonly usage, etc.).

7. **Recommendations & Next Steps**  
   – Short actionable suggestions (unified routing strategy, introduce `src/services/`, expand JSDoc, centralise HTTP client, enforce naming via ESLint rule, bump test coverage metrics).

---

## Output Format (`.agent/project-summary.md`)

```
# Project Summary – Oak-Web-Application

## 1. Purpose …
## 2. Technology Stack …
## 3. Directory Structure …
## 4. Build & Deployment …
## 5. Quality Gates & Testing …
## 6. Strengths …
## 7. Risks / Weaknesses …
## 8. Recommendations …
## 9. Next Steps …
```

---

## Self-Checklist (for the AI)

- [ ] All info derived from repo, not assumed.
- [ ] No deep code assertions without evidence.
- [ ] Align terminology with the Cursor "Agentic Coding Copilot Principles".
- [ ] Keep summary concise (< 300 lines).
- [ ] Leave existing files unchanged except the two targets specified.

## Progress (Phase 1)

- [x] Broad-and-shallow scan complete – `.agent/project-summary.md` generated and reviewed.
- [x] Tasks 1-7 above delivered.

---

## Phase 2: Deep-Dive Scan (next sprint)

### Goals

Provide evidence-backed insight on code-level adherence to `agentic-coding-copilot-principles-always.mdc` and surface concrete refactor / tooling tickets.

### Focus Areas & Tasks

1. **Code Style & Conventions**  
   a. Measure file/function LOC outliers with `npx eslint --max-lines` rules or script.  
   b. Audit naming conventions across `src/` using regex search; list violations.  
   c. Scan for `console.*` outside allowed logger utilities.

2. **Type Safety & Runtime Validation**  
   a. Ripgrep for `any`, `unknown`, `as ` assertions; classify by folder.  
   b. Identify boundaries using Zod/Valibot parsing; flag missing guards.  
   c. Catalogue branded/opaque types and discriminated unions in `/types`.

3. **Architecture & Separation**  
   a. Generate Madge dependency graphs for `src/components`, `node-lib`, `browser-lib` to highlight cross-layer coupling.  
   b. Detect server-only imports (`fs`, `path`) in client bundles (`'use client'`).

4. **Data Fetching & Error Handling**  
   a. Locate all `fetch`/`axios`/`graphql-request` usage; check for central HTTP client.  
   b. List custom error subclasses and their propagation patterns.  
   c. Verify Bugsnag error reporter is called in `catch` paths.

5. **Testing Depth**  
   a. Collect Jest coverage summary, set baseline in CI.  
   b. Count Storybook stories per component folder.  
   c. List missing Pa11y scenarios for high-traffic pages.

6. **Documentation & Comments**  
   a. Sample 100 exported symbols; compute JSDoc presence ratio.  
   b. Flag public exports lacking `@param`/`@returns`.

### Deliverables

1. Update `.agent/project-summary.md` with a new **Deep-Dive Findings** section structured per focus area above.
2. Create a ticket list (markdown table) in `.agent/deep-dive-tickets.md` mapping each finding → recommended action → estimated effort.
3. Update this plan with Phase 2 completion checklist and outline Phase 3 (refactor & implementation road-map).

## Phase 2 Status

- [x] Code-style sampling (LOC outliers, console usage)
- [x] Type-safety audit (`any`, branded types)
- [x] Architecture dependency graph (Madge) & circular-deps list
- [x] Data-fetch count & HTTP-client gap identified
- [x] Jest coverage baseline captured (84 %)
- [x] Storybook story count & gap analysis
- [x] JSDoc sampling
- [x] Tickets 1-13 created / updated in `.agent/deep-dive-tickets.md`

_Phase 2 deliverables complete → ready to move on._

---

## Phase 3: Implementation & CI Enforcement (next milestones)

### Goal

Iteratively address high-priority tickets while embedding new quality gates into CI so regressions are caught automatically.

### Milestones & Tasks

1. **Foundational Tooling**  
   a. Add Madge circular-check step to CI (fails on new cycles) [#13].  
   b. Add Jest coverage gate (≥ 80 %) [#9].  
   c. Exclude generated code from ESLint LOC & `no-explicit-any` rules [#1, #4].

2. **Codebase Refactors**  
   a. Split `8_units.ts` into smaller modules [#2].  
   b. Introduce `src/lib/httpClient.ts` + migrate first 3 fetchers [#7].  
   c. Remove / replace console logs [#3].

3. **Architecture Cleanup**  
   a. Break top-risk circular dependencies (analytics, curriculum) [#13].  
   b. Create `src/services/` layer; move curriculum logic [#6].

4. **Quality & Docs**  
   a. Enable `eslint-plugin-jsdoc`; set 40 % initial threshold [#11].  
   b. Add Storybook coverage add-on; aim 80 % components documented [#10].  
   c. Expand Pa11y scenarios for lesson flows [#12].

### Definition of Done

• CI passes with new gates.  
• All High-priority tickets closed.  
• Updated summary reflects improvements.

---

## Self-Checklist (Phase 3 preparation)

- [ ] Update CI configs (GitHub Actions) for Madge & coverage.
- [ ] Draft RFC for routing unification & service layer introduction.
- [ ] Schedule refactor sprints with maintainers.
