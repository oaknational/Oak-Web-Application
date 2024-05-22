import { GraphQLClient } from "graphql-request";
import { DocumentNode } from "graphql";

import getServerConfig from "../getServerConfig";

import { getSdk } from "./generated/sdk";

const curriculumApiUrl = getServerConfig("curriculumApi2023Url");
const curriculumApiAuthType = getServerConfig("curriculumApiAuthType");
const curriculumApiAuthKey = getServerConfig("curriculumApi2023AuthKey");

/**
 * TS complaining when Headers in not typed.
 */
type Headers = { "x-oak-auth-type": string; "x-oak-auth-key": string };
const headers: Headers = {
  "x-oak-auth-type": curriculumApiAuthType,
  "x-oak-auth-key": curriculumApiAuthKey,
};

const graphqlClient = new GraphQLClient(curriculumApiUrl, { headers });
const sdk = getSdk(graphqlClient);

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
