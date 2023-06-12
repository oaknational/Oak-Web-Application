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

- `npm run test` will run the tests using `--watch`
- `npm run test:ci` will run the tests once and create a coverage report.

Unit tests only for now. Please write any tests dependent on a network connection, a database, filesystem or any other IO. They all run for each commit and we need to keep that fast.

### When They Run

- Manually with `npm run test`.
- On pre-commit.
- On push in a Github workflow.

### Location

Tests live next to the code they are testing wherever possible. Next does not allow any files under the `src/pages/` directory other than routes, so those test file are under the `src/__tests_/pages/` directory, mirroring the `src/pages` file structure.

Logic tests and snapshot tests should be in different files because their "failure" state has a different meaning. Snapshot tests should live next to the component they are testing, and have a name following the pattern `<component_name>.snapshot.test.tsx`.

## E2E Browser Tests

We use WebdriverIO. Note you will need to regularly update the dependency `chromedriver` in order for it to work locally with the evergreen browser Chrome.

```bash
npm i --save-dev chromedriver@latest
```

### When They Run

- Manually locally with `npm run wdio`. The dev server will need to already be running.
- In CI against Browserstack triggered in a GitHub workflow `npm run wdio:ci`.

### Location

The current tests live [here](../e2e_tests/browser/engineering/). The naming is intended to leave room for creating some product-facing tests using feature files, this is subject to change.

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
