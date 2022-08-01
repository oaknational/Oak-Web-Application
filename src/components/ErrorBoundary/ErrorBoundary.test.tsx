import Bugsnag from "@bugsnag/js";
import { render } from "@testing-library/react";
import { FC, useEffect } from "react";

import "../../__tests__/__helpers__/LocalStorageMock";
import CookieConsentProvider from "../../browser-lib/cookie-consent/CookieConsentProvider";

import ErrorBoundary from ".";

const mockNotify = jest.fn(async (err, cb) => cb(event));
Bugsnag.notify = mockNotify;

const TantrumChild = () => {
  useEffect(() => {
    throw new Error("Where's my toys");
  }, []);

  return <>Tantrum child</>;
};

const WithStatisticsConsent: FC = (props) => {
  return (
    <CookieConsentProvider
      {...props}
      __testMockValue={{
        showConsentManager: jest.fn(),
        hasConsentedTo: () => true,
      }}
    />
  );
};
const WithoutStatisticsConsent: FC = (props) => {
  return (
    <CookieConsentProvider
      {...props}
      __testMockValue={{
        showConsentManager: jest.fn(),
        hasConsentedTo: () => true,
      }}
    />
  );
};

describe("ErrorBoundary.tsx", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });
  test("[bugsnag:enabled] should render children if no error", () => {
    const { getByTestId } = render(
      <ErrorBoundary>
        <div data-testid="child">The app</div>
      </ErrorBoundary>,
      { wrapper: WithStatisticsConsent }
    );
    expect(getByTestId("child")).toBeInTheDocument();
  });
  test("[bugsnag:enabled] should render client error view in the case of an uncaught exception", () => {
    const { getByRole } = render(
      <ErrorBoundary>
        <TantrumChild />
      </ErrorBoundary>,
      { wrapper: WithStatisticsConsent }
    );
    expect(getByRole("heading", { level: 1 })).toHaveTextContent(
      "Client error occurred"
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
      { wrapper: WithStatisticsConsent }
    );
    expect(mockNotify).toHaveBeenCalled();
  });
  test("[bugsnag:disabled] should render children if no error", () => {
    const { getByTestId } = render(
      <ErrorBoundary>
        <div data-testid="child">The app</div>
      </ErrorBoundary>,
      { wrapper: WithoutStatisticsConsent }
    );
    expect(getByTestId("child")).toBeInTheDocument();
  });
  test("[bugsnag:disabled] should render client error view in the case of an uncaught exception", () => {
    const { getByRole } = render(
      <ErrorBoundary>
        <TantrumChild />
      </ErrorBoundary>,
      { wrapper: WithoutStatisticsConsent }
    );
    expect(getByRole("heading", { level: 1 })).toHaveTextContent(
      "Client error occurred"
    );
  });
  test("[bugsnag:disabled] should not call reportError", () => {
    render(
      <ErrorBoundary>
        <TantrumChild />
      </ErrorBoundary>,
      { wrapper: WithoutStatisticsConsent }
    );
    expect(mockNotify).not.toHaveBeenCalled();
  });
});
