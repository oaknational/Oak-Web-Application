# Oak Web Application

The Oak National Academy Web Application code base.

- [Getting started](#getting-started)
- [Automatic Checks](#automatic-checks)
  - [Unit tests](#unit-tests)
  - [End-to-End Browser Tests](#end-to-end-browser-tests)
  - [Pre-commit and Commit Message Hooks](#pre-commit-and-commit-message-hooks)
    - [Pre-commit](#pre-commit)
    - [Commit Message Validation](#commit-message-validation)
- [CI/CD](#cicd)
  - [Pull Requests and Automated Checks](#pull-requests-and-automated-checks)
  - [Builds and Deployments](#builds-and-deployments)
  - [Release Mechanism](#release-mechanism)
- [External Contributions](#external-contributions)
  - [Security and Bug Bounty](#security-and-bug-bounty)
  - [Contributing to the Code](#contributing-to-the-code)
- [Open Source Acknowledgements](#open-source-acknowledgements)

Other documentation can be found in standalone READMEs:

- Build
  - [Fetching Config](./scripts/build/fetch_config)
  - [Fetching Secrets](./scripts/build/fetch_secrets)
- Components
  - [Forms](./src/components/Forms)
  - [Icon](./src/components/Icon)
- Docs
  - [Images](./docs/images)
  - [Testing](./docs/testing.md)
  - [SEO](./docs/seo.md) Meta tags, JSON-LD, sitemaps, robots.txt etc.
- [Error Handling](./src/errors)
- [React Context](./src/context)

## Getting started

First, run the following to create a local environment file:

```bash
cp .env.test .env.development.local
```

and fill in any values, if required, by asking another member of the team.

Next, run:

```bash
touch .env
```

to create an environment file containing secret manager services and the Oak config location. See [here](https://www.notion.so/oaknationalacademy/How-to-set-up-OWA-21ae880e58bb40bfaaa289030e984abd?pvs=4) for further details.

Then, run the development server:

```bash
npm run dev 
```

## Automatic Checks

For more detail please see the [test documentation](docs/testing.md).

### Pa11y Tests

We run Pa11yCI in CI to check for deterministic accessibility issues. To run Pa11y locally start the dev server with `npm run dev`, then in another process run Pa11y with `npm run pa11y`.

### Unit Tests

Unit tests live next to the code they are testing wherever possible. Next does not allow any files under the `src/pages/` directory other than routes, so those test file are under the `src/__tests_/pages/` directory, mirroring the `src/pages` file structure.

- `npm run test` will run the tests using `--watch`
- `npm run test:ci` will run the tests once and create a coverage report.

### End-to-End Browser Tests

[Playwright](https://playwright.dev/) tests live [here](e2e_tests/browser), and can be run locally against Playwright binaries, locally against Browserstack, or in CI against Browserstack.

See the [testing docs for further details](./docs/testing.md#e2e-browser-tests).

### Pre-commit and Commit Message Hooks

We use [Husky to run pre-commit and commit message validating hooks](.husky), including unit tests, code linting, type checking, and commit message format checking.

#### Pre-commit

Currently this hook

- Formats the code using Prettier
- Runs style and code linting
- Runs the unit tests

#### Commit Message Validation

We use [Commitlint](https://commitlint.js.org/#/) to validate that commit message meet the [conventional commit](https://www.conventionalcommits.org/en/v1.0.0-beta.2/) standard. If you want help with the format you can use the interactive commit message prompt by running the script `npm run cc`, note you will need to have staged Git changes first or it will error (because there will be nothing to commit).

## CI/CD

### Pull Requests and Automated Checks

#### Required Github Secrets for Workflows

**TO DO**

- `A_SECRET_VALUE` - Some config or tool auth.

### Builds and Deployments

The app is built statically, with two caveats.

- On dynamic routes, an empty array and `fallback: "blocking"` is returned from `getStaticPaths`. This means that those pages are built on first request, then stored as if they had been built at build time. This allows us to build an app with tens of thousands of pages in a few minutes.
- All pages that use `getStaticProps` have incremental static regeneration turned on, which re-runs `getStaticProps` periodically on the server in order to rebuild the page with the latest data.

The upshot of these two pieces of config is that new pages become available automatically when the underlying data is updated, and existing pages get updated data when it is available, all without having to rebuild the app.

Oak preview and production builds are on Netlify.

#### Required Environment Variables for Builds

### Release Mechanism

- All changes to the `main` branch must happen through pull requests.
- Changes on the `main` branch trigger the `create_semantic_release` Github workflow which creates a Github release, and updates the package.json version number. The commit message has a structure set in [`release.config.js`](release.config.js).
- All commits on `main` will trigger a Vercel deploy, but non-release commits ([according to the commit message structure](scripts/build/cancel_vercel_build.js)), will be cancelled.
- The Vercel deployment will trigger the `deployment_checks` Github workflow.

## External Contributions

### Security and Bug Bounty

Please see our [security.txt](public/.well-known/security.txt) file.

### Contributing to the Code

We don't currently accept external contributions to the code base, but this is under review and we hope to find an approach the works for us and the community.

## Open Source Acknowledgements

As will all web projects we are dependent on open source libraries maintained by others. While it is not practical to acknowledge them all, we would nevertheless like to express our gratitude for the contributions and efforts of the OSS community. Our dependency list can be found in our [package.json](package.json) file.
