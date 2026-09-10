import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import { PupilReadOnlyBanner } from "./PupilReadOnlyBanner";

import { usePupilLessonProgress } from "@/context/PupilLessonProgress";
import { getDefaultLessonProgressState } from "@/context/PupilLessonProgress/pupilLessonProgressHelpers";

jest.mock("@oaknational/oak-components", () => ({
  OakInlineBanner: ({
    message,
    isOpen,
  }: {
    message: string;
    isOpen: boolean;
  }) => (
    <div data-testid="read-only-banner" data-open={String(isOpen)}>
      {message}
    </div>
  ),
}));

const message =
  "You have turned-in this assignment. You can review the lesson and see your previous answers.";

const initialise = (isReadOnly: boolean) =>
  usePupilLessonProgress.getState().initialiseLessonProgress({
    lessonSlug: "lesson-1",
    lessonReviewSections: ["intro"],
    isReadOnly,
  });

describe("PupilReadOnlyBanner", () => {
  beforeEach(() => {
    usePupilLessonProgress.setState(getDefaultLessonProgressState());
  });

  it("opens the read-only banner when progress is read-only", () => {
    initialise(true);

    render(<PupilReadOnlyBanner />);

    const banner = screen.getByTestId("read-only-banner");
    expect(banner).toHaveAttribute("data-open", "true");
    expect(banner).toHaveTextContent(message);
  });

  it("keeps the banner closed when progress is not read-only", () => {
    initialise(false);

    render(<PupilReadOnlyBanner />);

    expect(screen.getByTestId("read-only-banner")).toHaveAttribute(
      "data-open",
      "false",
    );
  });
});
