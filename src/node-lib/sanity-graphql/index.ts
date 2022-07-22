import { GraphQLClient } from "graphql-request";

import config from "../../config";

import { getSdk } from "./generated/sdk";

const client = new GraphQLClient(config.get("sanityGraphqlApiUrl"), {
  headers: { Authorization: `Bearer ${config.get("sanityGraphqlApiSecret")}` },
});

const sanityGraphqlApi = getSdk(client);

export default sanityGraphqlApi;
