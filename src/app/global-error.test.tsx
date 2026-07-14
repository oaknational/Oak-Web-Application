import { render, screen } from "@testing-library/react";

import GlobalError from "./global-error";

import errorReporter from "@/common-lib/error-reporter";

jest.mock("@/common-lib/error-reporter", () => jest.fn());

describe("global error", () => {
  const originalConsoleError = console.error;

  beforeEach(() => {
    // Global Error returns a <html> but the render method appends it to a <div>
    // so silence the invalid nesting error here
    jest.spyOn(console, "error").mockImplementation((...args: unknown[]) => {
      const [firstArg] = args;
      if (
        typeof firstArg === "string" &&
        firstArg.includes("validateDOMNesting")
      ) {
        return;
      }

      originalConsoleError(...args);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("reports the error and renders the error view", () => {
    const reportErrorMock = jest.fn();
    (errorReporter as jest.Mock).mockReturnValue(reportErrorMock);

    const error = Object.assign(new Error("Something went wrong"), {
      digest: "abc123",
    });

    render(<GlobalError error={error} reset={jest.fn()} />);

    const errorMessage = screen.getByRole("heading", {
      name: "An error occurred",
    });
    expect(errorMessage).toBeInTheDocument();
    expect(errorReporter).toHaveBeenCalledWith("app::global-layout");
    expect(reportErrorMock).toHaveBeenCalledWith(error);
  });
});
