import { GraphQLClient } from "graphql-request";
import { DocumentNode } from "graphql";
import polly from "polly-js";

import getServerConfig from "../getServerConfig";

import { getSdk } from "./generated/sdk";

import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";

const curriculumApiUrl = getServerConfig("curriculumApi2023Url");
const curriculumApiAuthKey = getServerConfig("curriculumApi2026AuthKey");

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
console.log("Curriculum API auth key in sdk", curriculumApiAuthKey, headers); // Log the auth key to verify it's being read correctly
const graphqlClient = new GraphQLClient(curriculumApiUrl, { headers });
const retryCount = 3;
const withRetries = <T>(
  action: (requestHeaders?: Record<string, string>) => Promise<T>,
  operationName: string,
) =>
  polly()
    .logger((error: Error) =>
      console.warn("GraphQLClient:Error", { err: error }),
    )
    .waitAndRetry(retryCount)
    .executeForPromise((info) => {
      if (info.count === retryCount) {
        console.error("GraphqlClient:MaxRetries", {
          ...info,
          queryName: operationName,
        });
        // report timeout errors
        const timeoutError = new OakError({
          code: "graphql/timeout",
          meta: { queryName: operationName, action: action.toString() },
        });
        reportError(timeoutError);
      } else if (info.count > 0) {
        console.warn("GraphqlClient:RetryingCall", {
          ...info,
          queryName: operationName, // name of the query being retried
        });
      }
      return action();
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
