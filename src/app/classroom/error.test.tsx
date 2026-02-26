import { render } from "@testing-library/react";

import ClassroomErrorBoundary from "./error";

import errorReporter from "@/common-lib/error-reporter";

const googleClassroomErrorViewMock = jest.fn();

jest.mock("@/common-lib/error-reporter", () => jest.fn());

jest.mock("@/components/GoogleClassroom/GoogleClassroomErrorView", () =>
  jest.fn((props) => {
    googleClassroomErrorViewMock(props);
    return <div data-testid="google-classroom-error-view" />;
  }),
);

describe("src/app/classroom/error", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("reports the error and renders the error view with status 500", () => {
    const reportHandlerMock = jest.fn();
    (errorReporter as jest.Mock).mockReturnValue(reportHandlerMock);

    const error = Object.assign(new Error("Something went wrong"), {
      digest: "abc123",
    });

    const { getByTestId } = render(<ClassroomErrorBoundary error={error} />);

    expect(getByTestId("google-classroom-error-view")).toBeInTheDocument();
    expect(googleClassroomErrorViewMock).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 500 }),
    );
    expect(errorReporter).toHaveBeenCalledWith("classroom::error-boundary");
    expect(reportHandlerMock).toHaveBeenCalledWith(error);
  });
});
