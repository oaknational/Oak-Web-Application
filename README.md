# Samara

A really good remote education app.

## Testing

Unit tests only for now, please no note write any tests dependent on a network connection, a database, a filesystem or any other IO.

Tests live next to the code they are testing wherever possible. Next does not allow any files under the `src/pages/` directory other than routes, so those test file are under the `src/__tests_/pages/` directory, mirroring the `src/pages` file structure.

- `npm run test` will run the tests using `--watch`
- `npm run test:ci` will run the tests once and create a coverage report.

## Pre-commit and Commit Message Hooks

We use [Husky to run pre-commit and commit message validating hooks](.husky).

### Pre-commit

Currently this hook

- Formats the code using Prettier
- Runs the linting
- Runs the unit tests

### Commit Message Validation

We use [Commitlint](https://commitlint.js.org/#/) to validate that commit message meet the [conventional commit](https://www.conventionalcommits.org/en/v1.0.0-beta.2/) standard. If you want help with the format you can use the interactive commit message prompt by running the script `npm run cc`, note you will need to have staged Git changes first or it will error (because there will be nothing to commit).

## Release Mechanism

[DRAFT]

- All changes to the `main` branch must happen through pull requests.
- Changes on the `main` branch trigger the `create_semantic_release` Github workflow which creates a Github release (and updates the package.json version number).
- The creation of a Github release will trigger the `vercel_deployment` workflow.
- The Vercel deployment will trigger the `deployment_checks` Github workflow.

### TO DO

- Make sure the Github release created from the workflow actually triggers the `vercel_deployment` workflow. Workflows are generally prevented from triggering other workflows, to avoid infinite loops and leaking of secure info. If this is a problem, set the github token to be a Github PAT with appropriate permissions.
- Create the actual `semantic_release` workflow steps. Note, this will need to be run with a PAT from the machine user, and the machine user given permissions to commit directly to the `main` branch, otherwise the semantic-release tooling won't be able to update the package.json version file or commit to changelog file.
