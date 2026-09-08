# Testing

Note, this document is about automated tests and checks. Manual testing is beyond the scope of this document, and somewhat exists outside of the lifecycle of this code base. We regard the human evaluation of the subjective experience of our apps as vital, as well as appreciating the irreplaceable value of human exploratory testing.

All of our automation, including automated checks, are events driven. Diagram 1. shows the current key events.

![Key events driving automated checks in this repository](./images/sdlc_events.excalidraw.svg#gh-light-mode-only)
![Key events driving automated checks in this repository](./images/sdlc_events_dark.excalidraw.svg#gh-dark-mode-only)
_Diagram 1. The key events driving automated checks and tests in this repository. Note that preview and production deployments trigger the same deployment status checks._

## Linting and Style Checks

- Prettier
- ESlint
- Stylelint

## Code Checks

We use [Jest](https://jestjs.io/), with the [NextJS Jest Config](../jest.config.js).

- `pnpm run test` will run the tests using `--watch`
- `pnpm run test:ci` will run the tests once and create a coverage report.

Unit tests only for now. Please write any tests dependent on a network connection, a database, filesystem or any other IO. They all run for each commit and we need to keep that fast.

### When They Run

- Manually with `pnpm run test`.
- On pre-commit.
- On push in a Github workflow.

### Location

Tests live next to the code they are testing wherever possible. Next does not allow any files under the `src/pages/` directory other than routes, so those test file are under the `src/__tests_/pages/` directory, mirroring the `src/pages` file structure.

Logic tests and snapshot tests should be in different files because their "failure" state has a different meaning. Snapshot tests should live next to the component they are testing, and have a name following the pattern `<component_name>.snapshot.test.tsx`.

## Playwright E2E

We use [Playwright](https://playwright.dev/) for browser-based end-to-end tests.

Before running Playwright tests locally, install browser binaries once per machine:

- `pnpm exec playwright install chromium`

### Location

- E2E test files live under [src/\_\_tests\_\_/e2e](../src/__tests__/e2e/).
- Current teacher flow tests live in [src/\_\_tests\_\_/e2e/teacher/lesson-page.spec.ts](../src/__tests__/e2e/teacher/lesson-page.spec.ts).
- Playwright config lives in [playwright.config.ts](../playwright.config.ts).

### Commands

- `pnpm run test:e2e` runs all Playwright tests.
- `pnpm run test:e2e -- src/\_\_tests\_\_/e2e/teacher/lesson-page.spec.ts` runs a single spec.
- `pnpm run test:e2e:ci` runs Playwright with the HTML report enabled.
- `pnpm run test:e2e:visual` runs only tests tagged with `@visual`.
- `pnpm run test:chromatic` runs visual specs and then uploads snapshots to Chromatic.

### Local Execution

- If `BASE_URL` is not set, Playwright uses `http://localhost:3000` and automatically starts the local dev server via Playwright `webServer`.
- To run against a deployment URL, set `BASE_URL` to that deployment URL before running tests.

### CI Behavior

- Playwright CI runs in the PR workflow [`.github/workflows/pr_playwright_preview_tests.yml`](../.github/workflows/pr_playwright_preview_tests.yml), which waits for the PR preview deployment and then runs tests against that URL.
- The shared Playwright action caches Chromium binaries (keyed by OS, architecture, and Playwright version), installs required system dependencies, and uploads the HTML report artifact.
- Retries are configured as `1` in CI and `0` locally.

### Visual Snapshot Tests (Playwright + Chromatic)

- Visual snapshot specs live alongside E2E tests and should be tagged with `@visual`.
- Current example: [src/tests/e2e/teacher/lesson-page.visual.spec.ts](../src/tests/e2e/teacher/lesson-page.visual.spec.ts).
- Use `takeSnapshot(page, name, testInfo)` from `@chromatic-com/playwright` inside those specs.
- `playwright.config.ts` keeps `disableAutoSnapshot: true`, so snapshots are only captured where `takeSnapshot` is called.

Required environment variables for Chromatic runs:

- `CHROMATIC_PROJECT_TOKEN`
- `BASE_URL` (target deployment URL)
- `VERCEL_AUTOMATION_BYPASS_SECRET` (for protected Vercel previews)

### Jest Separation

- Unit tests run with Jest and E2E tests run with Playwright.
- Jest ignores `src/\_\_tests\_\_/e2e/` so Playwright specs are not run during `pnpm run test:ci`.

## Storybook

- Design and engineering inspection of components in isolation, including a11y checks.
- Storybook test runner can be used to check that all stories compile without errors using:
  1. `pnpm exec playwright install`
  2. `pnpm run test:storybook`
- These tests will also run in CI.

## Percy

Visual regression testing of deployed apps via URL discovery (`percy.snapshot.list.js`) and deployment-event workflows.

### When They Run

In a Github workflow triggered by a `deployment_status === success` event.

## Pa11y

Accessibility testing of deployed apps.

### When They Run

In a Github workflow triggered by a `deployment_status === success` event.
