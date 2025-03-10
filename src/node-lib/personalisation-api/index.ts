import { GraphQLClient } from "graphql-request";

import { createUserQuery } from "./queries/createUser/createUser.query";
import { getUserQuery } from "./queries/getUser/getUser.query";

import { getSdk } from "@/node-lib/personalisation-api/generated/sdk";
import { GetToken } from "clerk";

const personalisationApi = async ({ getToken }: { getToken: GetToken }) => {
  const token = await getToken({ template: "hasura" });
  const graphqlClient = new GraphQLClient("http://localhost:8190/v1/graphql", {
    headers: { authorization: `Bearer ${token}` },
  });
  const sdk = getSdk(graphqlClient);
  return {
    createUser: createUserQuery(sdk),
    getUser: getUserQuery(sdk),
  };
};

export type PersonalisationApi = ReturnType<typeof personalisationApi>;
export default personalisationApi;
