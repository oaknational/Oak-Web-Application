import { render } from "@testing-library/react";
import { FC } from "react";
import { ThemeProvider } from "styled-components";
import Bugsnag from "@bugsnag/js";

import ErrorBoundary from ".";

import noop from "@/__tests__/__helpers__/noop";
import theme from "@/styles/theme";

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

const TantrumChild = () => {
  throw new Error("Where's my toys");
};

const WithThemeProvider: FC = (props) => {
  return <ThemeProvider theme={theme} {...props} />;
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
});
