import Bugsnag from "@bugsnag/js";
import { render } from "@testing-library/react";
import { FC, useEffect } from "react";
import { ThemeProvider } from "styled-components";
import { MockOakConsentClient } from "@oaknational/oak-consent-client";

import ErrorBoundary from ".";

import noop from "@/__tests__/__helpers__/noop";
import "@/__tests__/__helpers__/LocalStorageMock";
import theme from "@/styles/theme";
import CookieConsentProvider from "@/browser-lib/cookie-consent/CookieConsentProvider";

const consoleLogSpy = jest.spyOn(console, "log");
const consoleErrorSpy = jest.spyOn(console, "error");

// eslint-disable-next-line @typescript-eslint/no-var-requires
const useRouter = jest.spyOn(require("next/router"), "useRouter");
useRouter.mockReturnValue({
  asPath: "test asPath value",
});

const mockNotify = jest.fn(async (err, cb) => cb(event));
Bugsnag.notify = mockNotify;

const TantrumChild = () => {
  useEffect(() => {
    throw new Error("Where's my toys");
  }, []);

  return <>Tantrum child</>;
};

const WithStatisticsConsent: FC = (props) => {
  const client = new MockOakConsentClient();
  client.getConsent = () => "granted";

  return (
    <ThemeProvider theme={theme}>
      <CookieConsentProvider client={client} {...props} />
    </ThemeProvider>
  );
};
const WithoutStatisticsConsent: FC = (props) => {
  const client = new MockOakConsentClient();
  client.getConsent = () => "denied";

  return (
    <ThemeProvider theme={theme}>
      <CookieConsentProvider client={client} {...props} />
    </ThemeProvider>
  );
};

describe("ErrorBoundary.tsx", () => {
  beforeEach(() => {
    consoleErrorSpy.mockImplementation(noop);
    consoleLogSpy.mockImplementation(noop);

    window.localStorage.clear();
  });
  test("[bugsnag:enabled] should render children if no error", () => {
    const { getByTestId } = render(
      <ErrorBoundary>
        <div data-testid="child">The app</div>
      </ErrorBoundary>,
      { wrapper: WithStatisticsConsent },
    );
    expect(getByTestId("child")).toBeInTheDocument();
  });
  test("[bugsnag:enabled] should render client error view in the case of an uncaught exception", () => {
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
  test.skip("[bugsnag:enabled] should call reportError", () => {
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
  test("[bugsnag:disabled] should render children if no error", () => {
    const { getByTestId } = render(
      <ErrorBoundary>
        <div data-testid="child">The app</div>
      </ErrorBoundary>,
      { wrapper: WithoutStatisticsConsent },
    );
    expect(getByTestId("child")).toBeInTheDocument();
  });
  test("[bugsnag:disabled] should render client error view in the case of an uncaught exception", () => {
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
  test("[bugsnag:disabled] should not call reportError", () => {
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
