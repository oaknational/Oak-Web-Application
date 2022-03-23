import { GraphQLClient } from "graphql-request";

import { getSdk } from "./generated/sdk";



const graphqlApiUrl = process.env.HASURA_GRAPHQL_API_URL || "";

// if (!graphqlApiUrl) {
//   throw new Error("Please set process.env.HASURA_GRAPHQL_API_URL");
// }
const client = new GraphQLClient(graphqlApiUrl);

const hasura = getSdk(client);

export default hasura;
