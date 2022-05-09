import { FC } from "react";
import { MockedProvider } from "@apollo/client/testing";

import apolloMocks from "./apolloMocks";

/**
 * MockedApolloProvider is a very naive implementation. It will mock responses for
 * queries/mutations stored in ./apolloMocks.ts
 * However it does not store any state, so if you add a record then fetch all records,
 * it will not know of the record you have fetched.
 * This implementation suffices for the most part, but when testing mutations, you will
 * need to create a mocked store within that test file. As an example, of this
 * see useBookmarks.test.tsx
 *
 * */
const MockedApolloProvider: FC = (props) => {
  return <MockedProvider mocks={apolloMocks} addTypename={false} {...props} />;
};

export default MockedApolloProvider;
