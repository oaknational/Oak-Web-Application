import { GraphQLClient } from "graphql-request";

import getServerConfig from "@/node-lib/getServerConfig";
import { getSdk } from "@/node-lib/educator-api/generated/sdk";
import { GetToken } from "clerk";

const educatorApiEndpoint = getServerConfig("educatorApiUrl");
const educatorApiAuthKey = getServerConfig("educatorApiAuthKey");
const educatorApiAuthRole = getServerConfig("educatorApiAuthRole");

// Api for use with authenticated Clerk user
export const getAuthenticatedEducatorApi = async (getToken: GetToken) => {
  const token = await getToken({ template: "hasura" });
  if (!token) {
    throw new Error("Failed to retrieve token");
  }
  const graphqlClient = new GraphQLClient(educatorApiEndpoint, {
    headers: { authorization: `Bearer ${token}` },
  });
  return getSdk(graphqlClient);
};

// Api for use in authenticated Clerk webhook endpoint
export const getWebhookEducatorApi = async (userId: string) => {
  const graphqlClient = new GraphQLClient(educatorApiEndpoint, {
    headers: {
      "X-Hasura-Admin-Secret": educatorApiAuthKey,
      "X-Hasura-Role": educatorApiAuthRole,
      "X-Hasura-User-Id": userId,
    },
  });
  return getSdk(graphqlClient);
};
