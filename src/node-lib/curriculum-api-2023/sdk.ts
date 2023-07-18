import { GraphQLClient } from "graphql-request";

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

export type Sdk = typeof sdk;
export default sdk;
