import { render } from "@testing-library/react";

import NotFound from "./not-found";

const googleClassroomErrorViewMock = jest.fn();

jest.mock("@/components/GoogleClassroom/GoogleClassroomErrorView", () =>
  jest.fn((props) => {
    googleClassroomErrorViewMock(props);
    return <div data-testid="google-classroom-error-view" />;
  }),
);

describe("src/app/classroom/not-found", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the error view with status 404", () => {
    const { getByTestId } = render(<NotFound />);

    expect(getByTestId("google-classroom-error-view")).toBeInTheDocument();
    expect(googleClassroomErrorViewMock).toHaveBeenCalledWith(
      expect.objectContaining({ statusCode: 404 }),
    );
  });
});
