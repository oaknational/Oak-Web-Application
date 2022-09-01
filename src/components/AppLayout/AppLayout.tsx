import { FC } from "react";
import { ApolloProvider } from "@apollo/client";

import { BookmarksProvider } from "../../context/Bookmarks";
import { AuthProvider } from "../../context/Auth";
import Layout, { LayoutProps } from "../Layout";
import useApolloClient from "../../browser-lib/graphql/useApolloClient";
import { AuthProviderValue } from "../../context/Auth/AuthProvider";
import { BookmarksProviderValue } from "../../context/Bookmarks/BookmarksProvider";

export type AppLayoutProps = LayoutProps & {
  authProviderValue?: Partial<AuthProviderValue>;
  bookmarksProviderValue?: Partial<BookmarksProviderValue>;
};
const AppLayout: FC<AppLayoutProps> = (props) => {
  const {
    children,
    authProviderValue,
    bookmarksProviderValue,
    ...layoutProps
  } = props;
  const apolloClient = useApolloClient();

  return (
    <AuthProvider value={authProviderValue}>
      <ApolloProvider client={apolloClient}>
        <BookmarksProvider {...bookmarksProviderValue}>
          <Layout headerVariant="app" {...layoutProps}>
            {children}
          </Layout>
        </BookmarksProvider>
      </ApolloProvider>
    </AuthProvider>
  );
};

export default AppLayout;
