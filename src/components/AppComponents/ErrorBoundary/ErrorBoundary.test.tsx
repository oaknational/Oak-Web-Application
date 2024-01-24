import { beforeEach, describe, expect, it, vi } from "vitest";
import Bugsnag from "@bugsnag/js";
import { render } from "@testing-library/react";
import { FC, useEffect } from "react";
import { ThemeProvider } from "styled-components";

import ErrorBoundary from ".";

import CookieConsentProvider from "@/browser-lib/cookie-consent/CookieConsentProvider";
import noop from "@/__tests__/__helpers__/noop";
import "@/__tests__/__helpers__/LocalStorageMock";
import theme from "@/styles/theme";

const consoleLogSpy = vi.spyOn(console, "log");
const consoleErrorSpy = vi.spyOn(console, "error");

// eslint-disable-next-line @typescript-eslint/no-var-requires
const useRouter = vi.spyOn(require("next/router"), "useRouter");
useRouter.mockReturnValue({
  asPath: "test asPath value",
});

const mockNotify = vi.fn(async (err, cb) => cb(event));
Bugsnag.notify = mockNotify;

const TantrumChild = () => {
  useEffect(() => {
    throw new Error("Where's my toys");
  }, []);

  return <>Tantrum child</>;
};

const WithStatisticsConsent: FC = (props) => {
  return (
    <ThemeProvider theme={theme}>
      <CookieConsentProvider
        {...props}
        __testMockValue={{
          showConsentManager: vi.fn(),
          hasConsentedTo: () => "enabled",
          hasConsentedToPolicy: () => "enabled",
        }}
      />
    </ThemeProvider>
  );
};
const WithoutStatisticsConsent: FC = (props) => {
  return (
    <ThemeProvider theme={theme}>
      <CookieConsentProvider
        {...props}
        __testMockValue={{
          showConsentManager: vi.fn(),
          hasConsentedTo: () => "disabled",
          hasConsentedToPolicy: () => "disabled",
        }}
      />
    </ThemeProvider>
  );
};

describe("ErrorBoundary.tsx", () => {
  beforeEach(() => {
    consoleErrorSpy.mockImplementation(noop);
    consoleLogSpy.mockImplementation(noop);

    window.localStorage.clear();
  });
  it("[bugsnag:enabled] should render children if no error", () => {
    const { getByTestId } = render(
      <ErrorBoundary>
        <div data-testid="child">The app</div>
      </ErrorBoundary>,
      { wrapper: WithStatisticsConsent },
    );
    expect(getByTestId("child")).toBeInTheDocument();
  });
  it("[bugsnag:enabled] should render client error view in the case of an uncaught exception", () => {
    const { getByRole } = render(
      <ErrorBoundary>
        <TantrumChild />
      </ErrorBoundary>,
      { wrapper: WithStatisticsConsent },
    );
    expect(getByRole("heading", { level: 1 })).toHaveTextContent(
      "An error occurred",
    );
  });
  it.skip("[bugsnag:enabled] should call reportError", () => {
    /**
     * @TODO fix this test
     */
    render(
      <ErrorBoundary>
        <TantrumChild />
      </ErrorBoundary>,
      { wrapper: WithStatisticsConsent },
    );
    expect(mockNotify).toHaveBeenCalled();
  });
  it("[bugsnag:disabled] should render children if no error", () => {
    const { getByTestId } = render(
      <ErrorBoundary>
        <div data-testid="child">The app</div>
      </ErrorBoundary>,
      { wrapper: WithoutStatisticsConsent },
    );
    expect(getByTestId("child")).toBeInTheDocument();
  });
  it("[bugsnag:disabled] should render client error view in the case of an uncaught exception", () => {
    const { getByRole } = render(
      <ErrorBoundary>
        <TantrumChild />
      </ErrorBoundary>,
      { wrapper: WithoutStatisticsConsent },
    );
    expect(getByRole("heading", { level: 1 })).toHaveTextContent(
      "An error occurred",
    );
  });
  it("[bugsnag:disabled] should not call reportError", () => {
    render(
      <ErrorBoundary>
        <TantrumChild />
      </ErrorBoundary>,
      { wrapper: WithoutStatisticsConsent },
    );
    expect(mockNotify).not.toHaveBeenCalled();
  });
  it("contains a button with link to homepage", () => {
    const { getByTestId } = render(
      <ErrorBoundary>
        <TantrumChild />
      </ErrorBoundary>,
      { wrapper: WithoutStatisticsConsent },
    );
    expect(getByTestId("homeButton").closest("a")).toHaveAttribute("href", "/");
  });
});
