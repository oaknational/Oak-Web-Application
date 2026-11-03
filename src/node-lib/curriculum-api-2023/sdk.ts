import { ClientError, GraphQLClient } from "graphql-request";

import getServerConfig from "../getServerConfig";

import { getSdk } from "./generated/sdk";

import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";

const curriculumApiUrl = getServerConfig("curriculumApi2023Url");
const curriculumApiAuthKey = getServerConfig("curriculumApiAuthKeyV2");

type Headers = {
  Authorization: string;
};
const headers: Headers = {
  Authorization: `Bearer ${curriculumApiAuthKey}`,
};
const reportError = errorReporter("Graphql sdk");

const graphqlClient = new GraphQLClient(curriculumApiUrl, {
  headers,
});

// Aborts can reject with a DOMException, which is not
// guaranteed to be `instanceof Error` across realms, so check the name
export const isTimeoutError = (error: unknown) =>
  typeof error === "object" &&
  error !== null &&
  "name" in error &&
  (error.name === "TimeoutError" || error.name === "AbortError");

const getResponseStatus = (error: unknown) =>
  error instanceof ClientError ? error.response.status : undefined;

export const withErrorReporting = async <T>(
  action: (requestHeaders?: Record<string, string>) => Promise<T>,
  operationName: string,
  _operationType?: string,
  variables?: unknown,
) => {
  try {
    return await action();
  } catch (error: unknown) {
    const status = getResponseStatus(error);
    // A 403 is an expected response (e.g. WAF block), not an error state
    if (status === 403) {
      throw error;
    }

    void reportError(
      new OakError({
        code: isTimeoutError(error)
          ? "graphql/timeout"
          : "graphql/request-failed",
        originalError: error,
        meta: {
          queryName: operationName,
          variables,
          status,
        },
      }),
    );
    throw error;
  }
};

const sdk = getSdk(graphqlClient, withErrorReporting);

export type Sdk = typeof sdk;
export default sdk;
