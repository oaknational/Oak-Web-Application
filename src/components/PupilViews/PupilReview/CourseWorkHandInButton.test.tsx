import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

import { CourseWorkHandInButton } from "./CourseWorkHandInButton";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import googleClassroomApi from "@/browser-lib/google-classroom/googleClassroomApi";

jest.mock("@/browser-lib/google-classroom/googleClassroomApi", () => ({
  __esModule: true,
  default: {
    turnInCourseWork: jest.fn(),
  },
}));

const mockTurnInCourseWork = googleClassroomApi.turnInCourseWork as jest.Mock;

describe("CourseWorkHandInButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockTurnInCourseWork.mockResolvedValue(undefined);
  });

  it("shows the hand-in button", () => {
    const { getByText } = renderWithTheme(
      <CourseWorkHandInButton assignmentToken="test-token" />,
    );

    expect(getByText("Hand in")).toBeInTheDocument();
  });

  it("shows a loading spinner and updated label while handing in", async () => {
    mockTurnInCourseWork.mockReturnValue(new Promise(() => {}));

    const { getByText, getByRole } = renderWithTheme(
      <CourseWorkHandInButton assignmentToken="test-token" />,
    );

    await userEvent.click(getByText("Hand in"));

    expect(getByText("Handing in…")).toBeInTheDocument();
    expect(getByRole("button", { name: /Handing in/i })).toBeDisabled();
  });

  it("shows a success message and disables the button after handing in", async () => {
    const { getByText, getByRole } = renderWithTheme(
      <CourseWorkHandInButton assignmentToken="test-token" />,
    );

    await userEvent.click(getByText("Hand in"));

    expect(getByText("Assignment handed in successfully!")).toBeInTheDocument();
    expect(getByText("Handed in")).toBeInTheDocument();
    expect(getByRole("button", { name: /Handed in/i })).toBeDisabled();
  });

  it("shows an error message when hand-in fails", async () => {
    mockTurnInCourseWork.mockRejectedValueOnce(new Error("Network error"));

    const { getByText } = renderWithTheme(
      <CourseWorkHandInButton assignmentToken="test-token" />,
    );

    await userEvent.click(getByText("Hand in"));

    expect(
      getByText("Failed to hand in. Please try again."),
    ).toBeInTheDocument();
    expect(getByText("Hand in")).toBeInTheDocument();
  });
});
