import { render } from "@testing-library/react";
import { FC } from "react";
import { ThemeProvider } from "styled-components";
import Bugsnag from "@bugsnag/js";
import { MockOakConsentClient } from "@oaknational/oak-consent-client";

import ErrorBoundary from ".";

import noop from "@/__tests__/__helpers__/noop";
import theme from "@/styles/theme";
import CookieConsentProvider from "@/browser-lib/cookie-consent/CookieConsentProvider";

const consoleLogSpy = jest.spyOn(console, "log");
const consoleErrorSpy = jest.spyOn(console, "error");

jest.mock("@/components/AppComponents/ErrorBoundary/ErrorBoundary", () => {
  return {
    __esModule: true,
    ...jest.requireActual(
      "@/components/AppComponents/ErrorBoundary/ErrorBoundary",
    ),
  };
});

// The Sentry ErrorBoundary and Bugsnag plugin for creating one
// are both globally mocked in our Jest setup file, so we need to
// restore the functionality here to use the actual implementations
jest.mock("@bugsnag/js", () => ({
  getPlugin: jest.requireActual("@bugsnag/js").getPlugin,
}));

jest.mock("@sentry/nextjs", () => ({
  ErrorBoundary: jest.requireActual("@sentry/nextjs").ErrorBoundary,
}));

const mockNotify = jest.fn(async (err, cb) => cb(event));
Bugsnag.notify = mockNotify;

const TantrumChild = () => {
  throw new Error("Where's my toys");
};

const WithThemeProvider: FC = (props) => {
  return <ThemeProvider theme={theme} {...props} />;
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
  });

  it("should render children if no error", () => {
    const { getByTestId } = render(
      <ErrorBoundary>
        <div data-testid="child">The app</div>
      </ErrorBoundary>,
      { wrapper: WithThemeProvider },
    );

    expect(getByTestId("child")).toBeInTheDocument();
  });

  describe("when an error occurs", () => {
    it("should render client error view in the case of an uncaught exception", () => {
      const { getByRole } = render(
        <ErrorBoundary>
          <TantrumChild />
        </ErrorBoundary>,
        { wrapper: WithThemeProvider },
      );

      expect(getByRole("heading", { level: 1 })).toHaveTextContent(
        "An error occurred",
      );
    });

    it("should contain a button with link to homepage", () => {
      const { getByTestId } = render(
        <ErrorBoundary>
          <TantrumChild />
        </ErrorBoundary>,
        { wrapper: WithThemeProvider },
      );

      expect(getByTestId("homeButton").closest("a")).toHaveAttribute(
        "href",
        "/",
      );
    });

    it("should still work when Bugsnag boundary is not available", () => {
      jest.spyOn(Bugsnag, "getPlugin").mockReturnValue(undefined);

      const { getByRole } = render(
        <ErrorBoundary>
          <TantrumChild />
        </ErrorBoundary>,
        { wrapper: WithThemeProvider },
      );

      expect(getByRole("heading", { level: 1 })).toHaveTextContent(
        "An error occurred",
      );
    });
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
