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
import { OverlayProvider } from "react-aria";

import "../../browser-lib/oak-globals/oakGlobals";
import { SearchProvider } from "../../context/Search/SearchContext";
import theme from "../../styles/theme";
import ErrorBoundary from "../../components/ErrorBoundary";
import { MenuProvider } from "../../context/Menu";
import { ToastProvider } from "../../context/Toast";

import MockedAnalyticsProvider from "./MockedAnalyticsProvider";
import MockedCookieConsentProvider from "./MockedCookieConsentProvider";

export type ProviderProps = {
  children?: React.ReactNode;
};

export const AllTheProviders: FC<ProviderProps> = ({ children }) => {
  return (
    <MockedCookieConsentProvider>
      <ThemeProvider theme={theme}>
        <ErrorBoundary>
          <MockedAnalyticsProvider>
            <MemoryRouterProvider>
              <OverlayProvider>
                <SearchProvider>
                  <ToastProvider>
                    <MenuProvider>{children}</MenuProvider>
                  </ToastProvider>
                </SearchProvider>
              </OverlayProvider>
            </MemoryRouterProvider>
          </MockedAnalyticsProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </MockedCookieConsentProvider>
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
