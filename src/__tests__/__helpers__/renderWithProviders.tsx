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
import { ThemeProvider } from "styled-components";

import "../../browser-lib/oak-globals/oakGlobals";
import { BookmarksProvider } from "../../context/Bookmarks";
import { SearchProvider } from "../../context/Search/SearchContext";
import theme from "../../styles/theme";
import CookieConsentProvider from "../../browser-lib/cookie-consent/CookieConsentProvider";
import AnalyticsProvider from "../../context/Analytics/AnalyticsProvider";

import MockedAuthProvider, {
  MockedAuthProviderProps,
} from "./MockedAuthProvider";
import MockedApolloProvider from "./MockedApolloProvider";

type ProviderProps = {
  authProviderProps?: MockedAuthProviderProps;
};

export const AllTheProviders: FC<ProviderProps> = ({
  children,
  authProviderProps,
}) => {
  return (
    <CookieConsentProvider>
      <AnalyticsProvider>
        <MockedAuthProvider {...authProviderProps}>
          <MockedApolloProvider>
            <ThemeProvider theme={theme}>
              <MemoryRouterProvider>
                <BookmarksProvider>
                  <SearchProvider>{children}</SearchProvider>
                </BookmarksProvider>
              </MemoryRouterProvider>
            </ThemeProvider>
          </MockedApolloProvider>
        </MockedAuthProvider>
      </AnalyticsProvider>
    </CookieConsentProvider>
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
