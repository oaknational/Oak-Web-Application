import { FC } from "react";
import { MockedProvider } from "@apollo/client/testing";

import apolloMocks from "./apolloMocks";

const MockedApolloProvider: FC = (props) => {
  return <MockedProvider mocks={apolloMocks} addTypename={false} {...props} />;
};

export default MockedApolloProvider;
