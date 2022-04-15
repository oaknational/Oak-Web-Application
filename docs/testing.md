# Testing

## Code Tests

We use [Jest](https://jestjs.io/), with the [NextJS Jest Config](../jest.config.js).

- `npm run test` will run the tests using `--watch`
- `npm run test:ci` will run the tests once and create a coverage report.

Unit tests only for now. Please write any tests dependent on a network connection, a database, filesystem or any other IO. They all run for each commit and we need to keep that fast.

### When They Run

- Manually with `npm run test`.
- On pre-commit.
- On push in a Github workflow.

### Location

Tests live next to the code they are testing wherever possible. Next does not allow any files under the `src/pages/` directory other than routes, so those test file are under the `src/__tests_/pages/` directory, mirroring the `src/pages` file structure.

Logic tests and snapshot tests should be in different files because their "failure" state has a different meaning. Snapshot tests should live next to the component they are testing, and have a name following the pattern `<component_name>.snapshot.test.tsx`. Note that we are hoping to have Storybook generate snapshots for all tests automatically, so these files be removed in future.

## E2E Browser Tests

We use [Playwright](https://playwright.dev/).

### When They Run

- Manually against local Playwright binaries with `npm run playwright:test`. If you have no already downloaded the binaries you will need to run `npm run playwright:install` first.
- Manually, locally, against Browserstack `npm run playwright:test:bs_local`. You will need `BROWSERSTACK_USERNAME` and `BROWSERSTACK_ACCESS_KEY` in your `.env` file. You can get those values from Browserstack by logging in.
- On push in a Github workflow, against Browserstack.

### Location

The current tests live [here](../e2e_tests/browser/engineering/). The naming is intended to leave room for creating some product-facing tests using feature files, this is subject to change.

## Storybook

- Automated snapshot tests
- Automated component a11y tests.

## Percy

Visual regression testing of deployed apps.

### When They Run

In a Github workflow triggered by a `deployment_status === success` event.

## Pa11y

Accessibility testing of deployed apps.

### When They Run

In a Github workflow triggered by a `deployment_status === success` event.
