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
import ErrorBoundary from "../../components/ErrorBoundary";
import AnalyticsProvider from "../../context/Analytics/AnalyticsProvider";
import { MenuProvider } from "../../context/Menu";

import MockedAuthProvider, {
  MockedAuthProviderProps,
} from "./MockedAuthProvider";
import MockedApolloProvider from "./MockedApolloProvider";

export type ProviderProps = {
  authProviderProps?: MockedAuthProviderProps;
};

const noopAvoLogger = {
  logDebug: () => true,
  logWarn: () => true,
  // returning false will make avo use console errors, which
  // we may prefer for actual errors
  logError: () => false,
};

export const AllTheProviders: FC<ProviderProps> = ({
  children,
  authProviderProps,
}) => {
  return (
    <CookieConsentProvider>
      <ThemeProvider theme={theme}>
        <ErrorBoundary>
          <AnalyticsProvider avoOptions={{ avoLogger: noopAvoLogger }}>
            <MockedAuthProvider {...authProviderProps}>
              <MockedApolloProvider>
                <MemoryRouterProvider>
                  <BookmarksProvider>
                    <SearchProvider>
                      <MenuProvider>{children}</MenuProvider>
                    </SearchProvider>
                  </BookmarksProvider>
                </MemoryRouterProvider>
              </MockedApolloProvider>
            </MockedAuthProvider>
          </AnalyticsProvider>
        </ErrorBoundary>
      </ThemeProvider>
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
