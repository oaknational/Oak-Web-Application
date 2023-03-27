# Fetching Config

Non-secret Oak app config can be in a local file, or fetched from a network location.

Secrets are handled by [a different mechanism](../fetch_secrets/).

Note, these values are for building and running the app. There are other values, e.g. the environment variables required to run some of the CI workflows, that can only be set directly as environment variables in the appropriate environment.

## Specifying Config Location

Config location is specified with the environment variables `OAK_CONFIG_LOCATION`. If it starts with the string `http` it is assumed to be a network location that will serve a JSON file on a GET request, otherwise it is assumed to be a path on the local file system.

If no value is specified it will default to the file system path `oak-config/oak.config.json` relative to the project root directory.

## Example Values

Examples values can be found in [oak.config.test.json](../../../oak-config/oak.config.test.json).

## Values for Test Environments

Fake values for use in unit testing are provided by the file [oak.config.test.json](../../../oak.config.test.json) and automatically used by Jest when the Next config is read in the test phase (the version of Jest bundled with Next reads the Next config).

## Schema [TO DO]

Types are generated from [oak.config.test.json](../../../oak-config/oak.config.test.json), but we should also use a schema to validate the read values.

Use JSON schema?

- @todo create a schema.
- @todo check the read values match the schema.
- @todo find a way to tell VSCode about the schema so it can prompt/check during editing, Prettier does it.
