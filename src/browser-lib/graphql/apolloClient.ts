import { useEffect, useState } from "react";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

import useAccessToken from "../../auth/useAccessToken";

function createApolloClient({ accessToken }: { accessToken: string | null }) {
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_GRAPHQL_API_URL,
      ...(accessToken
        ? {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        : {}),
    }),
    cache: new InMemoryCache(),
  });
}

export function useApolloClient() {
  const [accessToken] = useAccessToken();

  const [client] = useState(createApolloClient({ accessToken }));

  useEffect(() => {
    console.log("token change", accessToken);
  }, [accessToken]);

  useEffect(() => {
    // console.log("client change", client);
  }, [client]);

  return client;
}
