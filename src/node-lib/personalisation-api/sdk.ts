import { GraphQLClient } from "graphql-request";

import { getSdk } from "./generated/sdk";

/**
 * TS complaining when Headers in not typed.
 */
type Headers = {
  "x-hasura-admin-secret": string;
  "user-agent": string;
};
const headers: Headers = {
  "x-hasura-admin-secret": "adminsecretstring",
  "user-agent": "OWA Personalisation API Client",
};

const graphqlClient = new GraphQLClient("http://localhost:8190/v1/graphql", {
  headers,
});
const sdk = getSdk(graphqlClient);

export type Sdk = typeof sdk;
export default sdk;
