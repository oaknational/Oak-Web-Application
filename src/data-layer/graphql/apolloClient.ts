import { useState } from "react";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

function createApolloClient({ accessToken }: { accessToken?: string }) {
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_GRAPHQL_API_URL,
      ...(accessToken
        ? {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              credentials: "same-origin",
            },
          }
        : {
            credentials: "same-origin",
          }),
    }),
    cache: new InMemoryCache(),
  });
}

export function useApolloClient({ accessToken }: { accessToken?: string }) {
  const [client] = useState(createApolloClient({ accessToken }));

  return client;
}
