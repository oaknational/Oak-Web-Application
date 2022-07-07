# Error Handling

The intention of good error handling is as follows:

- To gracefully handle errors which occur in such a way that the user expects.
  - The user should see a polite message and be caused as little disruption as possilbe.
  - When the error can be remedied by user action, such action should be as simple as possible and be described clearly to them.
- To notify a service (we're using Bugsnag) in such a way that optimises the process of triage and bugfixing.
  - Details of the error, including the likely cause and information on the user journey leading to the error should be sent to the error reporting service.

## Error prevention

Better than handling errors is preventing them. User facing errors should be minimised by "catching" errors at build time using

- Strict type checking (Typescript, Graphql code generation, tRPC)
- Visual regression tests (Percy)
- Unit and integration tests

## OakError

We have extended the `Error` class to allow custom data to be passed when throwing the exception.

## Including context where available

Context helps us debug by identifying conditions that might allow us to reproduce the error.

- In a server side request handler this would include:
  - Url and method
  - Any headers, query, and payload

## Catch and rethrow

Catch errors, and if the error isn't an instance of `OakError` or if there's useful information to be added at this layer, then throw a new `OakError` with the original error as `originalError`. When thowing the new `OakError` we are forced to provide a code, which should indicate the cause of the error.

## Error codes

Each error code should represent a specific cause for an exception to be thrown. They are of the form `[section]/[reason]`, e.g. `auth/token-expired`. If the specific cause is unknown, the "reason" should be "unknown". E.g. `auth/token-error-unknown`. **NB We should consider adapting this format to include "action". E.g. `auth/refresh-token/unknown`**

- As far as we know, what caused the error?
- Can the error be remedied by user action?
  - E.g. "form validation" errors can be remedied by inputting different values
- Is this an error which we need to be notified of?
  - E.g. "token expired" errors don't need to alert us, since it is expected that they will happen
  - Likewise, "form validation" errors, don't need to alert us.
