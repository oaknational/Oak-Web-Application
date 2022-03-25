import { GraphQLClient } from "graphql-request";

const client = new GraphQLClient(
  process.env.NEXT_PUBLIC_GRAPHQL_API_URL || "",
  {
    credentials: "same-origin",
  }
);

export default client;
