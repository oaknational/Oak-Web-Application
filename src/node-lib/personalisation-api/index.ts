import { GraphQLClient } from "graphql-request";
import { useAuth } from "@clerk/nextjs";

import { getSdk } from "@/node-lib/personalisation-api/generated/sdk";
import { GetToken } from "clerk";

const personalisationEndpoint = "http://localhost:8190/v1/graphql";

export const createAuthenticatedSdk = async (getToken: GetToken) => {
  const token = await getToken({ template: "hasura" });
  const graphqlClient = new GraphQLClient(personalisationEndpoint, {
    headers: { authorization: `Bearer ${token}` },
  });
  return getSdk(graphqlClient);
};

export const usePersonalisationApi = () => {
  const { getToken, userId } = useAuth();
  if (!userId) {
    return null;
  }
  return {
    createUser: async () =>
      createAuthenticatedSdk(getToken).then((sdk) =>
        sdk.createUser({ userId }),
      ),
    getUser: async () =>
      createAuthenticatedSdk(getToken).then((sdk) => sdk.getUser({ userId })),
  };
};
