import { GraphQLClient } from "graphql-request";

import { getSdk } from "./generated/sdk";

const hasuraGraphqlApiUrl = process.env.HASURA_GRAPHQL_API_URL || "";
const hasuraAdminSecret = process.env.HASURA_ADMIN_SECRET || "";

// if (!graphqlApiUrl) {
//   throw new Error("Please set process.env.HASURA_GRAPHQL_API_URL");
// }
const client = new GraphQLClient(hasuraGraphqlApiUrl, {
  headers: { "x-hasura-admin-secret": hasuraAdminSecret },
});

const hasura = getSdk(client);

export default hasura;
