/**
 * A custom render to setup providers. Extends regular
 * render options with `providerProps` to allow injecting
 * different scenarios to test with.
 *
 * @see https://testing-library.com/docs/react-testing-library/setup#custom-render
 */
import React, { FC, ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { MockedProvider as MockedApolloProvider } from "@apollo/client/testing";

import { BookmarksProvider } from "../../hooks/useBookmarks";

import MockedAuthProvider from "./MockedAuthProvider";
import apolloMocks from "./apolloMocks";

const AllTheProviders: FC = ({ children }) => {
  return (
    <MockedAuthProvider>
      <MockedApolloProvider mocks={apolloMocks} addTypename={false}>
        <BookmarksProvider>{children}</BookmarksProvider>
      </MockedApolloProvider>
    </MockedAuthProvider>
  );
};

const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, { wrapper: AllTheProviders, ...options });

export default renderWithProviders;
