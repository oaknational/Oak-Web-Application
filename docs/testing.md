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

- E2E test files live under [src/tests/e2e](../src/tests/e2e/).
- Current teacher flow tests live in [src/tests/e2e/teacher/lesson-page.spec.ts](../src/tests/e2e/teacher/lesson-page.spec.ts).
- Playwright config lives in [playwright.config.ts](../playwright.config.ts).

### Commands

- `pnpm run test:e2e` runs all Playwright tests.
- `pnpm run test:e2e -- src/tests/e2e/teacher/lesson-page.spec.ts` runs a single spec.
- `pnpm run test:e2e:ci` runs Playwright with the HTML report enabled.

### Local Execution

- If `BASE_URL` is not set, Playwright uses `http://localhost:3000` and automatically starts the local dev server via Playwright `webServer`.
- To run against a deployment URL, set `BASE_URL` to that deployment URL before running tests.

### CI Behavior

- CI workflow wiring for Playwright is follow-up work. When added, CI should install Playwright browser binaries with `pnpm exec playwright install --with-deps chromium` before running tests and upload `playwright-report/` as an artifact.
- Retries are configured as `1` in CI and `0` locally.

### Jest Separation

- Unit tests run with Jest and E2E tests run with Playwright.
- Jest ignores `src/tests/e2e/` so Playwright specs are not run during `pnpm run test:ci`.

## Storybook

- Design and engineering inspection of components in isolation, including a11y checks.

## Percy

Visual regression testing of deployed apps.

### When They Run

In a Github workflow triggered by a `deployment_status === success` event.

## Pa11y

Accessibility testing of deployed apps.

### When They Run

In a Github workflow triggered by a `deployment_status === success` event.
