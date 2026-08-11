import LessonPlayAllButton from "./LessonPlayAllButton";

import { resolveOakHref } from "@/common-lib/urls";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("Copy link button", () => {
  it("renders", () => {
    const { getByText } = renderWithTheme(
      <LessonPlayAllButton
        lessonSlug="lesson-slug"
        unitSlug="unit-slug"
        programmeSlug="programme-slug"
        isCanonical={false}
        onTrackingCallback={() => {}}
      />,
    );

    expect(getByText("Play all")).toBeInTheDocument();
  });

  it("links to lesson media route", () => {
    const { getByText } = renderWithTheme(
      <LessonPlayAllButton
        lessonSlug="lesson-slug"
        unitSlug="unit-slug"
        programmeSlug="programme-slug"
        isCanonical={false}
      />,
    );

    expect(getByText("Play all").closest("a")).toHaveAttribute(
      "href",
      resolveOakHref({
        page: "lesson-media",
        lessonSlug: "lesson-slug",
        programmeSlug: "programme-slug",
        unitSlug: "unit-slug",
      }),
    );
  });

  describe("tracking", () => {
    it("calls the tracking callback when clicked", () => {
      const onTrackingCallback = jest.fn();
      const { getByText } = renderWithTheme(
        <LessonPlayAllButton
          lessonSlug="lesson-slug"
          unitSlug="unit-slug"
          programmeSlug="programme-slug"
          isCanonical={false}
          onTrackingCallback={onTrackingCallback}
        />,
      );

      const button = getByText("Play all");
      button.click();

      expect(onTrackingCallback).toHaveBeenCalled();
    });
  });
});
