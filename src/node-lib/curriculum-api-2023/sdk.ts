import { GraphQLClient } from "graphql-request";
import { DocumentNode } from "graphql";
import polly from "polly-js";

import getServerConfig from "../getServerConfig";

import { getSdk } from "./generated/sdk";

import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";

const curriculumApiUrl = getServerConfig("curriculumApi2023Url");
const curriculumApiAuthType = getServerConfig("curriculumApiAuthType");
const curriculumApiAuthKey = getServerConfig("curriculumApi2023AuthKey");

/**
 * TS complaining when Headers in not typed.
 */
type Headers = {
  "x-oak-auth-type": string;
  "x-oak-auth-key": string;
  "user-agent": string;
};
const headers: Headers = {
  "x-oak-auth-type": curriculumApiAuthType,
  "x-oak-auth-key": curriculumApiAuthKey,
  "user-agent": "OWA Curriculum API Client",
};

const reportError = errorReporter("Graphql sdk");
const graphqlClient = new GraphQLClient(curriculumApiUrl, { headers });

const retryCount = 3;
const withRetries = <T>(
  action: (requestHeaders?: Record<string, string>) => Promise<T>,
  operationName: string,
) =>
  polly()
    .handle((err: Error) => {
      // Retry timeout errors
      if (err.message.includes("connect ETIMEDOUT")) {
        console.warn("GraphQLClient:Timeout", operationName, err);
      }
      return err.message.includes("connect ETIMEDOUT");
    })
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
