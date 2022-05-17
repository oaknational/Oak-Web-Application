/**
 * A custom render to setup providers. Extends regular
 * render options with `providerProps` to allow injecting
 * different scenarios to test with.
 *
 * @see https://testing-library.com/docs/react-testing-library/setup#custom-render
 */
import React, { FC, ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { MemoryRouterProvider } from "next-router-mock/MemoryRouterProvider";

import { BookmarksProvider } from "../../hooks/useBookmarks";
import { UserStyleContextProvider } from "../../context/UserStyleContext";
import { SearchProvider } from "../../context/SearchContext";

import MockedAuthProvider, {
  MockedAuthProviderProps,
} from "./MockedAuthProvider";
import MockedApolloProvider from "./MockedApolloProvider";

type ProviderProps = {
  authProviderProps?: MockedAuthProviderProps;
};

const AllTheProviders: FC<ProviderProps> = ({
  children,
  authProviderProps,
}) => {
  return (
    <MockedAuthProvider {...authProviderProps}>
      <MockedApolloProvider>
        <UserStyleContextProvider>
          <MemoryRouterProvider>
            <BookmarksProvider>
              <SearchProvider>{children}</SearchProvider>
            </BookmarksProvider>
          </MemoryRouterProvider>
        </UserStyleContextProvider>
      </MockedApolloProvider>
    </MockedAuthProvider>
  );
};

const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
  providerProps?: ProviderProps
) => {
  const wrapper: FC = (props) => (
    <AllTheProviders {...props} {...providerProps} />
  );
  return render(ui, { wrapper, ...options });
};

export default renderWithProviders;
