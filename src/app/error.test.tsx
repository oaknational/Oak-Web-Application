import { screen } from "@testing-library/react";

import RootError from "./error";

import errorReporter from "@/common-lib/error-reporter";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

jest.mock("@/common-lib/error-reporter", () => jest.fn());

const render = renderWithProviders();
describe("app error", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("reports the error and renders the error view with status 500", () => {
    const reportErrorMock = jest.fn();
    (errorReporter as jest.Mock).mockReturnValue(reportErrorMock);

    const error = Object.assign(new Error("Something went wrong"), {
      digest: "abc123",
    });

    render(<RootError error={error} reset={jest.fn()} />);

    const errorMessage = screen.getByRole("heading", {
      name: "An error occurred",
    });
    expect(errorMessage).toBeInTheDocument();
    expect(errorReporter).toHaveBeenCalledWith("app::error-boundary");
    expect(reportErrorMock).toHaveBeenCalledWith(error);
  });
});
