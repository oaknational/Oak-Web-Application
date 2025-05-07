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
  queries,
  type RenderOptions,
  type RenderHookOptions,
  type RenderHookResult,
  type Queries,
} from "@testing-library/react";
import { MemoryRouterProvider } from "next-router-mock/MemoryRouterProvider";
import { ThemeProvider } from "styled-components";
import { OverlayProvider } from "react-aria";
import { MemoryRouterProviderProps } from "next-router-mock/dist/MemoryRouterProvider/MemoryRouterProvider";
import { OakThemeProvider, oakDefaultTheme } from "@oaknational/oak-components";
import { MockOakConsentClient } from "@oaknational/oak-consent-client";
import { pick } from "lodash";

import "../../browser-lib/oak-globals/oakGlobals";
import ErrorBoundary from "../../components/AppComponents/ErrorBoundary";
import { MenuProvider } from "../../context/Menu";
import { ToastProvider } from "../../context/Toast";

import MockedAnalyticsProvider from "./MockedAnalyticsProvider";

import theme, { OakTheme } from "@/styles/theme";
import CookieConsentProvider from "@/browser-lib/cookie-consent/CookieConsentProvider";
import { OakToastProvider } from "@/context/OakToast/OakToastProvider";

export type ProviderProps = {
  children?: React.ReactNode;
};

type ProviderPropsByName = {
  cookieConsent: { client: MockOakConsentClient };
  theme: { theme: OakTheme };
  oakTheme: { theme: typeof oakDefaultTheme };
  errorBoundary: Record<string, never>;
  analytics: Record<string, never>;
  router: MemoryRouterProviderProps;
  overlay: Record<string, never>;
  toast: Record<string, never>;
  menu: Record<string, never>;
  oakToast: Record<string, never>;
};

export type ProviderPartialProps = {
  [K in keyof ProviderPropsByName]: Partial<ProviderPropsByName[K]>;
};

const providersByName: {
  [K in keyof ProviderPropsByName]: [
    ElementType,
    Partial<ProviderPropsByName[K]>?,
  ];
} = {
  cookieConsent: [
    CookieConsentProvider,
    { client: new MockOakConsentClient() },
  ],
  theme: [ThemeProvider, { theme }],
  oakTheme: [OakThemeProvider, { theme: oakDefaultTheme }],
  errorBoundary: [ErrorBoundary],
  analytics: [MockedAnalyticsProvider],
  router: [MemoryRouterProvider],
  overlay: [OverlayProvider],
  toast: [ToastProvider],
  menu: [MenuProvider],
  oakToast: [OakToastProvider],
} as const;

type ProviderName = keyof ProviderPropsByName;

export const getMockedProviders =
  (providers: Partial<ProviderPartialProps>) =>
  ({ children }: { children?: ReactNode }) => {
    console.log("diego providers", providers, providersByName);
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
            children,
          )}
      </>
    );
  };

export const allProviders = Object.entries(providersByName).reduce(
  (acc, [name, [, defaultProps]]) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    acc[name] = defaultProps;
    return acc;
  },
  {} as ProviderPropsByName,
);

const renderWithProviders =
  (providers: Partial<ProviderPartialProps> = allProviders) =>
  (ui: ReactElement, renderOptions?: Omit<RenderOptions, "wrapper">) => {
    const MockedProviders = getMockedProviders(providers);
    return render(ui, { wrapper: MockedProviders, ...renderOptions });
  };

export const renderHookWithProviders = (
  providers: Partial<ProviderPartialProps> = allProviders,
) => {
  return <
    Result,
    Props,
    Q extends Queries = typeof queries,
    Container extends Element | DocumentFragment = HTMLElement,
    BaseElement extends Element | DocumentFragment = Container,
  >(
    hook: (initialProps: Props) => Result,
    renderHookOptions?: Omit<
      RenderHookOptions<Props, Q, Container, BaseElement>,
      "wrapper"
    >,
  ): RenderHookResult<Result, Props> => {
    const MockedProviders = getMockedProviders(providers);
    return renderHook(hook, {
      wrapper: MockedProviders,
      ...renderHookOptions,
      // `hydrate is boolean | undefined in the type, but false | undefined in the assignment, setting to false.
      hydrate: undefined,
    });
  };
};

export function renderWithProvidersByName(
  names: (keyof ProviderPropsByName)[],
) {
  return renderWithProviders(pick(allProviders, ...names));
}

export default renderWithProviders;
