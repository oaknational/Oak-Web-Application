import { FC } from "react";
import { ApolloProvider, useApolloClient } from "@apollo/client";

import { BookmarksProvider } from "../../context/Bookmarks";
import { AuthProvider } from "../../context/Auth";
import Layout, { LayoutProps } from "../Layout";

type AppLayoutProps = LayoutProps;
const AppLayout: FC<AppLayoutProps> = (props) => {
  const { children, ...layoutProps } = props;
  const apolloClient = useApolloClient();

  return (
    <AuthProvider>
      <ApolloProvider client={apolloClient}>
        <BookmarksProvider>
          <Layout headerVariant="app" {...layoutProps}>
            {children}
          </Layout>
        </BookmarksProvider>
      </ApolloProvider>
    </AuthProvider>
  );
};

export default AppLayout;
