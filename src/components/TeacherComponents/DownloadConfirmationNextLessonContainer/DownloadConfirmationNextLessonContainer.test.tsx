import { describe, expect, it, vi } from "vitest";

import DownloadConfirmationNextLessonContainer from "./DownloadConfirmationNextLessonContainer";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { TrackFns } from "@/context/Analytics/AnalyticsProvider";

const onwardContentSelected =
  vi.fn() as unknown as TrackFns["onwardContentSelected"];

const nextLessons = [
  {
    lessonSlug: "test-lesson",
    lessonTitle: "test-lesson-title",
  },
  {
    lessonSlug: "test-lesson-2",
    lessonTitle: "test-lesson-title-2",
  },
  {
    lessonSlug: "test-lesson-3",
    lessonTitle: "test-lesson-title-3",
  },
];

describe("DownloadConfirmationNextLessonContainer", () => {
  it("should render component", () => {
    const { getByRole } = renderWithTheme(
      <DownloadConfirmationNextLessonContainer
        programmeSlug="test-programme"
        unitSlug="test-unit"
        nextLessons={nextLessons}
        unitTitle="test-unit-title"
        onwardContentSelected={onwardContentSelected}
      />,
    );

    const nextLessonContainerTitle = getByRole("heading", {
      name: "More lessons in: test-unit-title",
    });

    expect(nextLessonContainerTitle).toBeInTheDocument();
  });
  it("when passed an array of 3 future lessons renders all 3", async () => {
    const { getAllByTestId } = renderWithTheme(
      <DownloadConfirmationNextLessonContainer
        programmeSlug="test-programme"
        unitSlug="test-unit"
        nextLessons={nextLessons}
        unitTitle="test-unit-title"
        onwardContentSelected={onwardContentSelected}
      />,
    );

    const nextLessonCards = await getAllByTestId("next-lesson-card");

    expect(nextLessonCards).toHaveLength(3);
  });
});
