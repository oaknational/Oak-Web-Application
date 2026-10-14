import { ClientError, GraphQLClient } from "graphql-request";
import { DocumentNode } from "graphql";
import polly from "polly-js";

import getServerConfig from "../getServerConfig";

import { getSdk } from "./generated/sdk";

import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";

const curriculumApiUrl = getServerConfig("curriculumApi2023Url");
const curriculumApiAuthKey = getServerConfig("curriculumApiAuthKeyV2");

/**
 * TS complaining when Headers in not typed.
 */
type Headers = {
  Authorization: string;
};
const headers: Headers = {
  Authorization: `Bearer ${curriculumApiAuthKey}`,
};
const reportError = errorReporter("Graphql sdk");

/**
 * Per-attempt timeout. Applied via a custom `fetch` so that every attempt
 * (including retries and batched requests) gets its own fresh deadline.
 */
export const ATTEMPT_TIMEOUT_MS = 10_000;

export const fetchWithTimeout: typeof fetch = (input, init) => {
  const timeoutSignal = AbortSignal.timeout(ATTEMPT_TIMEOUT_MS);
  const signal = init?.signal
    ? AbortSignal.any([init.signal, timeoutSignal])
    : timeoutSignal;
  return fetch(input, { ...init, signal });
};

const graphqlClient = new GraphQLClient(curriculumApiUrl, {
  headers,
  fetch: fetchWithTimeout,
});

// Same transient statuses as src/node-lib/sanity-graphql/fetchWithRetry.ts
const RETRYABLE_STATUSES = new Set([429, 502, 503, 504]);

// Aborts and AbortSignal.timeout() reject with a DOMException, which is not
// guaranteed to be `instanceof Error` across realms, so check the name
export const isTimeoutError = (error: unknown) =>
  typeof error === "object" &&
  error !== null &&
  "name" in error &&
  (error.name === "TimeoutError" || error.name === "AbortError");

const getResponseStatus = (error: unknown) =>
  error instanceof ClientError ? error.response.status : undefined;

/**
 * Only retry failures that are likely to succeed on a second attempt:
 * network errors (fetch rejects with a TypeError), timeouts/aborts, and
 * transient gateway/rate-limit statuses. Other 4xx (e.g. WAF 403s), 500s and
 * GraphQL errors are not retried.
 */
export const isRetryableError = (error: unknown) => {
  if (error instanceof TypeError || isTimeoutError(error)) {
    return true;
  }
  const status = getResponseStatus(error);
  return status !== undefined && RETRYABLE_STATUSES.has(status);
};

const retryCount = 3;
export const withRetries = <T>(
  action: (requestHeaders?: Record<string, string>) => Promise<T>,
  operationName: string,
  _operationType?: string,
  variables?: unknown,
) =>
  polly()
    .handle(isRetryableError)
    .logger((error: Error) =>
      console.warn("GraphqlClient:RetryingCall", {
        err: error,
        queryName: operationName,
      }),
    )
    .waitAndRetry(retryCount)
    .executeForPromise(() => action())
    .catch((error: unknown) => {
      // Report once, after the final failed attempt, then let callers handle it
      void reportError(
        new OakError({
          code: isTimeoutError(error)
            ? "graphql/timeout"
            : "graphql/request-failed",
          originalError: error,
          meta: {
            queryName: operationName,
            variables,
            status: getResponseStatus(error),
          },
        }),
      );
      throw error;
    });

const sdk = getSdk(graphqlClient, withRetries);

/*
 * batched queries not currently supported with the sdk
 * see https://github.com/dotansimha/graphql-code-generator-community/issues/204
 */
export const getBatchedRequests = async (
  requests: Array<{
    document: DocumentNode;
    variables: Record<string, unknown>;
  }>,
) => {
  const data = await graphqlClient.batchRequests(requests);
  return data;
};

/*types not exported from graphql-request library */
interface Result<Data extends object = object> {
  data: Data;
}

export type BatchResult = [Result, ...Result[]];

export type Sdk = typeof sdk;
export default sdk;
