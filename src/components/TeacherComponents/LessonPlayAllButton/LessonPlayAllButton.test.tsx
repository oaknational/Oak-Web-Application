import LessonPlayAllButton from "./LessonPlayAllButton";

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
