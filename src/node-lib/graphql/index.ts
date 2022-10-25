import { GraphQLClient } from "graphql-request";

import config from "../../config/server";

import { getSdk } from "./generated/sdk";

const client = new GraphQLClient(config.get("graphqlApiUrl"), {
  headers: { "x-hasura-admin-secret": config.get("hasuraAdminSecret") },
});

const graphqlApi = getSdk(client);

export default graphqlApi;
