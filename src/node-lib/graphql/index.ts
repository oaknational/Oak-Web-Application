import { GraphQLClient } from "graphql-request";

import serverConfig from "../../config/server";

import { getSdk } from "./generated/sdk";

const client = new GraphQLClient(serverConfig.get("graphqlApiUrl"), {
  headers: { "x-hasura-admin-secret": serverConfig.get("hasuraAdminSecret") },
});

const graphqlApi = getSdk(client);

export default graphqlApi;
