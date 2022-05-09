# Fetching Config

Non-secret Oak app config can be in a local file, or fetched from a network location.

## Example Values

Examples values can be found in [`../../../oak.config.example.json`](../../../oak.config.example.json).

## Values for Test Environments

Fake values for use in unit testing are provided by the file [`oak.config.test.json`](../../../oak.config.test.json) and automatically used by Jest when the Next config is read in the test phase (the version of Jest bundled with Next reads the Next config).

## Schema [TO DO]

Types are generated from [`../../../oak.config.example.json`](../../../oak.config.example.json), but we should also use a schema to validate the read values.

Use JSON schema?

- @todo create a schema.
- @todo check the read values match the schema.
- @todo find a way to tell VSCode about the schema so it can prompt/check during editing, Prettier does it.
