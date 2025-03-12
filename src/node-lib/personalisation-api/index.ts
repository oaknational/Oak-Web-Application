import { GraphQLClient } from "graphql-request";

import getServerConfig from "../getServerConfig";

import { getSdk } from "@/node-lib/personalisation-api/generated/sdk";
import { GetToken } from "clerk";

const personalisationEndpoint = getServerConfig("personalisationApiUrl");
const personalisationApiKey = getServerConfig("personalisationApiAuthKey");
const personalisationApiAuthRole = getServerConfig(
  "personalisationApiAuthRole",
);

// Api for use with authenticated Clerk user
export const getAuthenticatedPersonalisationApi = async (
  getToken: GetToken,
) => {
  const token = await getToken({ template: "hasura" });
  const graphqlClient = new GraphQLClient(personalisationEndpoint, {
    headers: { authorization: `Bearer ${token}` },
  });
  return getSdk(graphqlClient);
};

// Api for use in authenticated Clerk webhook endpoint
export const getWebhookPersonalisationApi = async (userId: string) => {
  const graphqlClient = new GraphQLClient(personalisationEndpoint, {
    headers: {
      "X-Hasura-Admin-Secret": personalisationApiKey,
      "X-Hasura-Role": personalisationApiAuthRole,
      "X-Hasura-User-Id": userId,
    },
  });
  return getSdk(graphqlClient);
};
