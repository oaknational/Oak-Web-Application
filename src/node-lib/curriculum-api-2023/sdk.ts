import { GraphQLClient } from "graphql-request";

import config from "../../config/server";

import { getSdk } from "./generated/sdk";

const curriculumApiUrl = config.get("curriculumApi2023Url");
const curriculumApiAuthType = config.get("curriculumApiAuthType");
const curriculumApiAuthKey = config.get("curriculumApi2023AuthKey");

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
