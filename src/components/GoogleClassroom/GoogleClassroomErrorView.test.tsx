import { fireEvent } from "@testing-library/react";
import { useRouter } from "next/navigation";

import GoogleClassroomErrorView from "./GoogleClassroomErrorView";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("GoogleClassroomErrorView", () => {
  const backMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      back: backMock,
    });
  });

  it("renders the provided status code", () => {
    const { getByRole } = renderWithTheme(
      <GoogleClassroomErrorView statusCode={500} />,
    );

    expect(getByRole("heading", { level: 1, name: "500" })).toBeInTheDocument();
  });

  it("renders a fallback heading when statusCode is not provided", () => {
    const { getByRole } = renderWithTheme(<GoogleClassroomErrorView />);

    expect(
      getByRole("heading", { level: 1, name: "An error occurred" }),
    ).toBeInTheDocument();
  });

  it("renders the supporting error copy", () => {
    const { getByRole, getByText } = renderWithTheme(
      <GoogleClassroomErrorView statusCode={404} />,
    );

    expect(
      getByRole("heading", {
        level: 2,
        name: "Whoops! It looks like you have fallen too far from the tree.",
      }),
    ).toBeInTheDocument();
    expect(getByText("Let's get you back to browsing")).toBeInTheDocument();
  });

  it("calls router.back when Go back is clicked", () => {
    const { getByRole } = renderWithTheme(
      <GoogleClassroomErrorView statusCode={500} />,
    );

    fireEvent.click(getByRole("button", { name: "Go back" }));

    expect(backMock).toHaveBeenCalledTimes(1);
  });
});
