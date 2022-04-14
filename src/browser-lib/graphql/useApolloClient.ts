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

function useApolloClient() {
  const [accessToken] = useAccessToken();

  const [client, setClient] = useState(createApolloClient({ accessToken }));

  useEffect(() => {
    setClient(createApolloClient({ accessToken }));
  }, [accessToken]);

  return client;
}

export default useApolloClient;
