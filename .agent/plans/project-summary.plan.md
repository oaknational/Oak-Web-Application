# Plan: Detailed Project Summary for Oak-Web-Application

**Objective:** To conduct a thorough review of the `Oak-Web-Application` project and document the findings in `.agent/project-summary.md`. The review will follow a broad-and-shallow-first approach, then a deep-dive, guided by the "Copilot instructions for Next.js projects".

**Agent:** GitHub Copilot

## Phase 1: Foundation & Broad Scan (Recap and Augmentation)

1. **Acknowledge Current State:**
   - Review information already processed: `package.json`, `tsconfig.json`, `next.config.js`, `.eslintrc.js`, `netlify.toml`, `vercel.json`, the project's directory structure, and the "Who we are" text from The National Academy.
   - Reiterate limitations: The review is based on configuration and static analysis; full source code access is needed for dynamic aspects and complete verification of certain code-level practices.
2. **Refine Broad Scan Findings in `.agent/project-summary.md`:**
   - **Project Identification & Technology Stack:**
     - Verify project name, framework (Next.js), language (TypeScript).
     - List and categorize key dependencies from `package.json` (React, state management, styling, UI components, routing, API/GraphQL, error monitoring, analytics, testing, linting/formatting, build tools).
   - **Structure Mapping:**
     - Document path aliases (`@/*` from `tsconfig.json`).
     - Analyze and describe the directory structure (e.g., `app/`, `src/`, `components/`, `node-lib/`, `pages/`, `scripts/`, `public/`, `.github/`, `e2e_tests/`). Note the implications of `app/` vs `pages/`.
     - List and summarize the purpose of key configuration files.
   - **Build & Workflow:**
     - Analyze `package.json` scripts (`dev`, `build`, `start`, `check-types`, `lint`, `format`, `test` suites, `gql-codegen`, `prepare`/Husky).
     - Detail build customizations found in `next.config.js` (bundle analysis, Bugsnag, static assets, SVGR).
     - Infer CI pipeline based on scripts and common practices (e.g., install → type-check → lint → test → build).
   - **Deployment:**
     - Describe hosting configurations (Netlify from `netlify.toml`, Vercel from `vercel.json`).
     - Note specific Netlify features (plugins, redirects, edge functions).
     - Identify static build configurations (`next export`, `isStaticBuild` in `next.config.js`).
   - **Linting & Formatting:**
     - Summarize ESLint setup (`.eslintrc.js`, `eslint-config-next`).
     - Summarize Prettier setup (`package.json`).
     - Note Stylelint usage.
     - Confirm pre-commit hook setup (Husky).

## Phase 2: Deep Dive Analysis (Against "Copilot instructions for Next.js projects")

For each section of the "Copilot instructions for Next.js projects" (Sections 1-9), analyze and document findings in `.agent/project-summary.md` under a "Deep Dive Findings" section. Clearly indicate where full code access is required for complete verification.

1. **Code Style & Size (Instruction Section 1):**
   - Assess based on linting rules and `next.config.js` (e.g., logging). Note limitations for file/function size and naming conventions without full code.
2. **Type Safety & Runtime Validation (Instruction Section 2):**
   - Verify `tsconfig.json` (`strict`, `noImplicitAny`, `noUncheckedIndexedAccess`) and ESLint rules (`@typescript-eslint/no-explicit-any`).
   - Note Zod dependency as an indicator for parsing/validation.
3. **Architecture & Separation of Concerns (Instruction Section 3):**
   - Analyze directory structure against Next.js layers (UI, Server Actions/API, Domain Services, Infrastructure).
   - Discuss the implications of `app/` and `pages/` coexistence.
4. **Imports, Exports & Module Boundaries (Instruction Section 4):**
   - Confirm path alias usage. Note limitations for barrel exports and internal JSDoc without full code.
5. **Data Fetching & HTTP Client (Instruction Section 5):**
   - Note `swr` and `node-fetch` dependencies. State inability to confirm centralized `HttpClient.ts` without full code.
6. **Documentation & Quality Gates (Instruction Section 6):**
   - Confirm tooling stack (ESLint, Prettier, type-check scripts).
   - Confirm pre-commit hooks (Husky). Note inability to assess JSDoc coverage.
7. **Testing Strategy (Instruction Section 7):**
   - Analyze `package.json` test scripts, Jest configuration, `e2e_tests/` directory, and dependencies like `jest-fetch-mock`, `pa11y`.
   - Note Storybook usage. State inability to confirm coverage actuals.
8. **Development Workflow & Scripts (Instruction Section 8):**
   - Verify `package.json` scripts against suggested workflow. Confirm package manager (`npm`).
9. **Next.js-Specific Conventions (Instruction Section 9):**
   - Confirm App Router usage (`app/` dir).
   - Analyze environment variable handling in `next.config.js`. Note limitations for assessing Server Components preference and dynamic imports.

## Phase 3: Synthesis, Contextualization, and Recommendations

1. **Integrate Organizational Context:**
   - Incorporate insights from "Who we are" (The National Academy) into the summary.
   - Discuss implications for the project: accessibility (A11y), scalability, reliability, user experience, content delivery (Sanity, Mux).
2. **Compile Key Findings:**
   - Summarize **Strengths** observed (e.g., strong typing, comprehensive testing setup, modern Next.js features, automated quality gates, detailed build/deployment).
   - Identify **Areas for Potential Investigation** (requiring full code access or clarification), e.g., mixed routing strategy, code/file sizes, JSDoc coverage, specific architectural pattern implementations, naming convention adherence, barrel export usage.
3. **Formulate Recommendations:**
   - Suggest actionable steps based on findings.
4. **Define Next Steps for the Review Process:**
   - Clearly state the need for full source code access for a complete review.
   - Request clarification on specific points (e.g., routing strategy if mixed).

## Phase 4: Plan Review and Output Generation

1. **Self-Review Plan:** Ensure the plan is comprehensive, directly addresses the user's request, and clearly outlines how the "Copilot instructions" will be utilized.
2. **Generate Output:** Update `.agent/project-summary.md` progressively according to this plan.

## Phase 3: Deep Codebase Scan (Detailed Investigation)

This phase focuses on a granular analysis of the codebase to verify adherence to the "Copilot instructions for Next.js projects," using the provided codebase search results and file structure information.

**1. Code Style, Size, and Conventions (Instruction 1)**

- **1.1. File/Function LOC:**
  - **Task:** Based on the provided search results (e.g., `#attachment_search_results_src_components_naming`), analyze the apparent complexity of the matched code snippets. While a full LOC count isn't possible without direct file access, assess if the snippets suggest overly long files or functions.
  - **Instruction:** 1.1, 1.2
  - **Evidence:** Note any snippets that appear to be part of very large type definitions or complex logic that might exceed ~200 LOC for files or ~40 LOC for functions/methods.
- **1.2. File Naming Conventions:**
  - **Task:** Review file paths in search results (e.g., `#attachment_search_results_src_components_naming`, `#attachment_search_results_src_hooks_naming`) for adherence to `camelCase.ts[x]` or `PascalCase.tsx` for components.
  - **Instruction:** 1.3
  - **Key Files/Directories:** `src/components/` (expect `PascalCase.tsx` or `index.tsx` in `PascalCase` folder), `src/hooks/` (expect `camelCase.ts`). Note: `src/services/` is not used.
  - **Evidence:** Document actual naming patterns and any deviations. Note common patterns (e.g., `kebab-case` in `pages` directory is expected if not using App Router primarily).
- **1.3. `readonly`/`Readonly<>` Usage:**
  - **Task:** Scan provided type definitions and component props (if visible in snippets from `#attachment_search_results_src_components_naming`) for `readonly` or `Readonly<>`.
  - **Instruction:** 1.4
  - **Evidence:** Note prevalence and consistency, especially given ESLint rule status from `project-summary.md`.
- **1.4. `console.*` Usage:**
  - **Task:** Search snippets for `console.*` calls.
  - **Instruction:** 1.7
  - **Evidence:** Identify usage outside of what might be considered config/designated logging.
- **1.5. Comments:**
  - **Task:** Review snippets for the nature of comments.
  - **Instruction:** 1.8
  - **Evidence:** Look for explanatory comments ("why") versus descriptive comments ("what"). Note any commented-out code.

**2. Type Safety (Instruction 2)**

- **2.1. `any` or `unknown` Usage:**
  - **Task:** Search all provided code snippets for `any` or `unknown`.
  - **Instruction:** 2.1, 2.2
  - **Evidence:** List occurrences. For `unknown`, check if it's properly narrowed (may be hard to verify from snippets alone). Note if Zod/Valibot seems to be used for parsing at boundaries based on imports or type names.
- **2.2. Type Assertions (`as Foo`):**
  - **Task:** Search snippets for type assertions (`as Foo`, `<Foo>bar`).
  - **Instruction:** 2.3
  - **Evidence:** Document occurrences. Check for explanatory comments if the assertion is at a trust boundary (difficult to determine boundary from snippets alone).
- **2.3. Branded/Opaque Types and Discriminated Unions:**
  - **Task:** Look for patterns in type definitions that suggest Branded/Opaque types (e.g., `string & { __brand: 'UserId' }`) or Discriminated Unions (e.g., `type Shape = { kind: 'circle', radius: number } | { kind: 'square', sideLength: number }`).
  - **Instruction:** 2.4, 2.5
  - **Evidence:** Note any examples found.

**3. Error Handling (Instruction 3)**

- **3.1. Custom Error Types:**
  - **Task:** Look for `OakError` usage or definitions in the snippets (e.g., from `src/errors/OakError.ts` if present in search results).
  - **Instruction:** 3.1
  - **Evidence:** Note if `OakError` is consistently used for application-specific errors.
- **3.2. Error Reporting:**
  - **Task:** Search for `errorReporter` or Bugsnag/Sentry client usage.
  - **Instruction:** 3.2
  - **Evidence:** Note how errors seem to be reported.
- **3.3. `try...catch` Blocks:**
  - **Task:** Examine any `try...catch` blocks in snippets.
  - **Instruction:** 3.3
  - **Evidence:** Check if `catch` blocks handle errors appropriately (e.g., re-throwing as custom errors, reporting).

**4. Imports, Exports, and Modules (Instruction 4)**

- **4.1. `index.ts` Barrel Files:**
  - **Task:** Review file paths ending in `index.ts` from the search results (e.g., `#attachment_search_results_src_components_index_ts`). Infer if they are re-exporting modules.
  - **Instruction:** 4.1
  - **Evidence:** Note examples and assess if they appear to define a clear public API for their directory.
- **4.2. `/** @internal \*/` JSDoc:\*\*
  - **Task:** Scan snippets for `/** @internal */`.
  - **Instruction:** 4.2
  - **Evidence:** Document any usage.
- **4.3. Relative Path Depth:**
  - **Task:** Scan import paths in snippets for `../../../` or deeper.
  - **Instruction:** 4.3
  - **Evidence:** List occurrences.
- **4.4. Absolute Imports:**
  - **Task:** Check if imports from `src` use absolute paths (e.g., `import foo from "src/components/foo"` or aliased paths like `import foo from "@/components/foo"`).
  - **Instruction:** 4.4
  - **Evidence:** Note common import styles.

**5. Data Fetching & State Management (Instruction 5)**

- **5.1. Centralized HTTP Client:**
  - **Task:** Look for evidence of a centralized HTTP client (imports, function calls like `httpClient.get`) within `src/node-lib/`, `src/common-lib/`, or `src/browser-lib/` as `src/lib/` is not used.
  - **Instruction:** 5.1
  - **Evidence:** Note any findings.
- **5.2. Server-Side Data Fetching:**
  - **Task:** Examine snippets from `pages/` or `app/` directories for data fetching patterns (e.g., `getServerSideProps`, `getStaticProps`, Server Component async functions).
  - **Instruction:** 5.2
  - **Evidence:** Describe patterns observed.
- **5.3. Client-Side Data Fetching:**
  - **Task:** Look for client-side data fetching (e.g., SWR, React Query, custom hooks like `useFetch.ts` from `#attachment_search_results_src_hooks_naming`).
  - **Instruction:** 5.3
  - **Evidence:** Note libraries or patterns used.
- **5.4. Node-only APIs in Client Code:**
  - **Task:** Scan client-side component snippets (those with `'use client'` or in `pages/` without server-side data fetching functions) for Node.js specific APIs (e.g., `fs`, `path` direct usage).
  - **Instruction:** 5.6
  - **Evidence:** Document any suspicious usage.

**6. Documentation (Instruction 6)**

- **6.1. JSDoc Completeness:**
  - **Task:** Review JSDoc blocks in the provided snippets for exported functions, classes, and types.
  - **Instruction:** 6.1, 6.2, 6.3
  - **Evidence:** Check for `@param`, `@returns`, `@throws`, `@example`. Document findings on completeness for a sample of snippets.
- **6.2. Inline Comments for Complex Logic:**
  - **Task:** Identify complex logic in snippets and check for explanatory inline comments.
  - **Instruction:** 6.4
  - **Evidence:** Note examples of good commenting or lack thereof.

**9. Next.js Conventions (Instruction 9)**

- **9.1. App Router vs. Pages Router:**
  - **Task:** Determine the primary routing paradigm by observing file paths (`app/` vs `pages/`) from `#attachment_search_results_src_structure` and other search results.
  - **Instruction:** 9.1
  - **Evidence:** State the dominant router and describe the hybrid approach.
- **9.2. Server Components and Client Components:**
  - **Task:** Identify usage of `'use client'` in snippets from the `app/` directory.
  - **Instruction:** 9.2
  - **Evidence:** Assess adherence to "Server Components First" based on the presence or absence of `'use client'`.
- **9.3. `next/dynamic`:**
  - **Task:** Search snippets for `next/dynamic` imports.
  - **Instruction:** 9.6
  - **Evidence:** Note any usage for large client-side libraries.
- **9.4. Environment Variables:**
  - **Task:** Look for `process.env.NEXT_PUBLIC_` for client-side env vars and `process.env` for server-side.
  - **Instruction:** 9.7
  - **Evidence:** Document usage patterns if visible.
- **9.5. API Routes:**
  - **Task:** Given that `#attachment_search_results_pages_api_empty` and `#attachment_search_results_app_api_empty` indicate no API routes in the conventional directories, investigate how backend operations (CRUD, etc.) are handled. Are they part of server-side logic in `pages/` (e.g. in `getServerSideProps`), Server Components in `app/`, or calls to external backend services?
  - **Instruction:** 9.9 (adapted)
  - **Evidence:** Describe patterns for backend interactions.

**10. LLM Self-Checks (Instruction 10)**

- **Task:** After completing the scan and updating the project summary, conceptually review the findings against linting/typing best practices, context consideration, testing implications, atomic commit principles, documentation gaps, and performance/security hints.
- **Instruction:** 10.1 - 10.6
- **Evidence:** Internal checklist to ensure the analysis is robust.

This plan will guide the creation of a detailed and structured project summary.
