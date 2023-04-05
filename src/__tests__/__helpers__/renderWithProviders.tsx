/**
 * A custom render to setup providers. Extends regular
 * render options with `providerProps` to allow injecting
 * different scenarios to test with.
 *
 * @see https://testing-library.com/docs/react-testing-library/setup#custom-render
 */
import React, { ElementType, ReactElement, ReactNode } from "react";
import {
  render,
  renderHook,
  RenderOptions,
  RenderHookOptions,
  RenderHookResult,
  queries,
  Queries,
} from "@testing-library/react";
import { MemoryRouterProvider } from "next-router-mock/MemoryRouterProvider";
import { ThemeProvider } from "styled-components";
import { OverlayProvider } from "react-aria";
import { MemoryRouterProviderProps } from "next-router-mock/dist/MemoryRouterProvider/MemoryRouterProvider";

import "../../browser-lib/oak-globals/oakGlobals";
import theme, { OakTheme } from "../../styles/theme";
import ErrorBoundary from "../../components/ErrorBoundary";
import { MenuProvider } from "../../context/Menu";
import { ToastProvider } from "../../context/Toast";
import { CookieConsentContext } from "../../browser-lib/cookie-consent/CookieConsentProvider";

import MockedAnalyticsProvider from "./MockedAnalyticsProvider";
import MockedCookieConsentProvider from "./MockedCookieConsentProvider";

export type ProviderProps = {
  children?: React.ReactNode;
};

type ProviderPropsByName = {
  cookieConsent: { __testMockValue: CookieConsentContext };
  theme: { theme: OakTheme };
  errorBoundary: Record<string, never>;
  analytics: Record<string, never>;
  router: MemoryRouterProviderProps;
  overlay: Record<string, never>;
  toast: Record<string, never>;
  menu: Record<string, never>;
};

type ProviderPartialProps = {
  [K in keyof ProviderPropsByName]: Partial<ProviderPropsByName[K]>;
};

const providersByName: {
  [K in keyof ProviderPropsByName]: [
    ElementType,
    Partial<ProviderPropsByName[K]>?
  ];
} = {
  cookieConsent: [MockedCookieConsentProvider],
  theme: [ThemeProvider, { theme }],
  errorBoundary: [ErrorBoundary],
  analytics: [MockedAnalyticsProvider],
  router: [MemoryRouterProvider],
  overlay: [OverlayProvider],
  toast: [ToastProvider],
  menu: [MenuProvider],
};

type ProviderName = keyof ProviderPropsByName;

export const getMockedProviders =
  (providers: Partial<ProviderPartialProps>) =>
  ({ children }: { children?: ReactNode }) => {
    return (
      <>
        {Object.entries(providersByName)
          .filter(([providerName]) => providerName in providers)
          .reduceRight(
            (componentTree, [providerName, [Provider, defaultProps]]) => {
              const props = providers[providerName as ProviderName];
              return (
                <Provider {...defaultProps} {...props}>
                  {componentTree}
                </Provider>
              );
            },
            children
          )}
      </>
    );
  };

const allProviders = Object.entries(providersByName).reduce(
  (acc, [name, [, defaultProps]]) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    acc[name] = defaultProps;
    return acc;
  },
  {} as ProviderPropsByName
);

export type RenderWithProviderOptions = Omit<RenderOptions, "wrapper"> & {
  providers?: Partial<ProviderPartialProps>;
};

const renderWithProviders = (
  ui: ReactElement,
  options: RenderWithProviderOptions = {}
) => {
  const { providers = allProviders, ...renderOptions } = options;
  const MockedProviders = getMockedProviders(providers);
  return render(ui, { wrapper: MockedProviders, ...renderOptions });
};

export const renderHookWithProviders = <
  Result,
  Props,
  Q extends Queries = typeof queries,
  Container extends Element | DocumentFragment = HTMLElement,
  BaseElement extends Element | DocumentFragment = Container
>(
  hook: (initialProps: Props) => Result,
  options: Omit<
    RenderHookOptions<Props, Q, Container, BaseElement>,
    "wrapper"
  > & {
    providers?: RenderWithProviderOptions["providers"];
  } = {}
): RenderHookResult<Result, Props> => {
  const { providers = allProviders, ...renderHookOptions } = options;
  const MockedProviders = getMockedProviders(providers);
  return renderHook(hook, { wrapper: MockedProviders, ...renderHookOptions });
};

export default renderWithProviders;
