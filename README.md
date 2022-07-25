# Oak Web Application!!

The Oak National Academy web application code base.

- [Getting started](#Getting-started)
- [Automatic Checks](#Automatic-Checks)
  - [Unit tests](#Unit-tests)
  - [End-to-End Browser Tests](#End-to-End-Browser-Tests)
  - [Pre-commit and Commit Message Hooks](#Pre-commit-and-Commit-Message-Hooks)
    - [Pre-commit](#Pre-commit)
    - [Commit Message Validation](#Commit-Message-Validation)
- [CI/CD](#CICD)
  - [Pull Requests and Automated Checks](#Pull-Requests-and-Automated-Checks)
  - [Builds and Deployments](#Builds-and-Deployments)
  - [Release Mechanism](#Release-Mechanism)
- [Npm dependencies](#Npm-dependencies)

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
- [Error Handling](./src/errors)
- Hasura
  - [Curriculum database](./hasura-curriculum)
  - [Users database](./hasura-users/)
- [React Context](./src/context)

## Getting started

First, run:

```bash
cp .env.test .env.development.local
```

and fill in the values by asking another member of the team.

Then, run the development server:

```bash
npm run dev
```

## Automatic Checks

For more detail please see the [test documentation](docs/testing.md).

### Unit tests

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
- Runs the linting
- Runs the unit tests

#### Commit Message Validation

We use [Commitlint](https://commitlint.js.org/#/) to validate that commit message meet the [conventional commit](https://www.conventionalcommits.org/en/v1.0.0-beta.2/) standard. If you want help with the format you can use the interactive commit message prompt by running the script `npm run cc`, note you will need to have staged Git changes first or it will error (because there will be nothing to commit).

## CI/CD

### Pull Requests and Automated Checks

#### Required Github Secrets for Workflows

**TO DO**

- `A_SECRET_VALUE` - Some config or tool auth.

### Builds and Deployments

- Preview builds on Vercel
- Production builds on Vercel

#### Required Environment Variables for Builds

**TO DO**

- `SOMETHING_TO_DO_WITH_HASURA` - So secret.

### Release Mechanism

- All changes to the `main` branch must happen through pull requests.
- Changes on the `main` branch trigger the `create_semantic_release` Github workflow which creates a Github release, and updates the package.json version number. The commit message has a structure set in [`release.config.js`](release.config.js).
- All commits on `main` will trigger a Vercel deploy, but non-release commits ([according to the commit message structure](scripts/build/cancel_vercel_build.js)), will be cancelled.
- The Vercel deployment will trigger the `deployment_checks` Github workflow.

## Npm dependencies

This documentation should be upto-date with the dependencies (not dev-) in package.json with an explanation of what it is.

This should help us avoid adding modules which duplicate functionality.

- @bugsnag/js

  - Main Bugsnag library (for bug reporting and tracking).

- @bugsnag/plugin-react

  - React library for Bugsnag

- @hookform/resolvers

  - Validation resolvers for react-hook-form (allows us to use zod schema for validation)

- firebase

  - Clientside firebase library

- firebase-admin

  - Backend (admin) firebase library

- next

- next-seo

  - SEO library for Nextjs applications

- node-fetch

  - Fetch implementation for nodejs

- react

- react-dom

- react-hook-form

  - Forms library for react

- styled-components

  - Styling library for react

- zod
  - Types
