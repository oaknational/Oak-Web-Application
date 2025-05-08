# Project Review Summary

## 1. Project Purpose

The Oak Web Application supports Oak National Academy, an online classroom and resource hub for teachers, pupils, and parents. It provides lesson planning resources, curriculum plans, and an AI lesson assistant. The platform is designed to be scalable, accessible, and user-friendly, catering to a diverse audience.

## 2. Current State of the Project

### Technology Stack

- **Framework:** Next.js (confirmed by `next` dependency, `next.config.js`, and `app/` directory presence).
- **Language:** TypeScript (strictly configured with `strict: true`, `noImplicitAny: true`, `noUncheckedIndexedAccess: true`).
- **Key Dependencies:**
  - **Core Framework:** `react`, `react-dom`, `next`.
  - **State Management:** `swr` for data fetching and caching.
  - **Styling:** `styled-components`.
  - **UI Components:** `@oaknational/oak-components`.
  - **CMS:** `@sanity/client`.
  - **Video:** `mux-embed`.
  - **Error Monitoring:** `@bugsnag/js`.
  - **Testing:** Jest, Playwright, Pa11y, Storybook.

### Structure

- **Routing:** Hybrid model with both `app/` (App Router) and `pages/` (Pages Router).
- **Directory Organization:**
  - `src/components/`: Organized by feature (e.g., `TeacherComponents`, `SharedComponents`).
  - `src/context/`: React Context providers.
  - `src/node-lib/`, `src/common-lib/`, `src/browser-lib/`: Shared utilities and infrastructure code.
  - `public/`: Static assets.
  - `.github/`: GitHub workflows and configurations.

### Build & Deployment

- **Hosting:** Dual-configured for Netlify and Vercel.
- **Static Builds:** Uses `next export` for static site generation with incremental static regeneration.
- **CI/CD:** Automated workflows with semantic release, pre-commit hooks (Husky), and quality gates.

### Strengths

- Strong TypeScript setup with robust linting and formatting.
- Comprehensive testing strategy covering unit, integration, E2E, and accessibility tests.
- Modern Next.js features, including App Router and path aliases.
- Automated quality gates and detailed build configurations.

### Weaknesses

- Hybrid routing strategy lacks clarity on long-term direction.
- Absence of `src/services/` and `src/lib/` directories for domain logic and infrastructure.
- Inconsistent file naming conventions (e.g., `PascalCase.tsx` vs. `camelCase.ts`).
- Limited use of `readonly`/`Readonly<>` despite TypeScript strictness.

## 3. Current Architecture and Design

### Layers

- **UI:** `app/` and `pages/` directories, with components in `src/components/`.
- **Server Actions/API:** No API routes in `pages/api/` or `app/api/`. Likely handled via `getServerSideProps`, `getStaticProps`, or external services.
- **Domain Services:** Distributed across `node-lib`, `common-lib`, and `browser-lib`.
- **Infrastructure:** Shared utilities in `common-lib` and `node-lib`.

### Observations

- **Error Handling:** Bugsnag integration is present but lacks centralized error reporting patterns.
- **Data Fetching:** Uses `swr` and custom hooks but lacks a centralized HTTP client.
- **Testing:** Strong setup but actual coverage percentages are unknown.
- **Documentation:** Limited JSDoc coverage for exported symbols.

## 4. Target Architecture and Design

### Goals

- **Simplify Routing:** Transition to a single routing paradigm (App Router or Pages Router).
- **Centralize Logic:** Introduce `src/services/` for domain logic and `src/lib/` for infrastructure.
- **Enforce Standards:**
  - Consistent file naming conventions.
  - Broader adoption of `readonly`/`Readonly<>`.
  - Comprehensive JSDoc coverage.
- **Enhance Error Handling:** Centralized error reporting and logging.
- **Improve Testing:** Ensure high coverage with clear metrics.

### Proposed Layers

- **UI:** Consolidate components and views under `src/components/`.
- **Server Actions/API:** Use `app/api/` for backend operations.
- **Domain Services:** Centralize business logic in `src/services/`.
- **Infrastructure:** Move shared utilities to `src/lib/`.

## 5. Recommendations

- Clarify the long-term routing strategy.
- Adopt consistent file naming conventions.
- Introduce centralized HTTP client and error handling.
- Expand JSDoc coverage and enforce standards via linting.
- Monitor and improve test coverage.

## 6. Next Steps

- Conduct a detailed review of routing and data fetching patterns.
- Define a migration plan for architecture changes.
- Establish guidelines for naming conventions and immutability.
- Enhance documentation and testing practices.
