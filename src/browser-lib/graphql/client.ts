import { GraphQLClient } from "graphql-request";

import config from "../../config";

const client = new GraphQLClient(config.get("graphqlApiUrl"));

export default client;
