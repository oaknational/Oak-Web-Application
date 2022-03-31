import { GraphQLClient } from "graphql-request";

import config from "../../config";

import { getSdk } from "./generated/sdk";

// if (!graphqlApiUrl) {
//   throw new Error("Please set process.env.HASURA_GRAPHQL_API_URL");
// }
const client = new GraphQLClient(config.get("graphqlApiUrl"), {
  headers: { "x-hasura-admin-secret": config.get("hasuraAdminSecret") },
});

const hasura = getSdk(client);

export default hasura;
