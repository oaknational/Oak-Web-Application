import LessonPlayAllButton from "./LessonPlayAllButton";

import { resolveOakHref } from "@/common-lib/urls";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const lessonMediaClipsStarted = jest.fn();
jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    getSessionId: jest.fn(),
    track: {
      lessonMediaClipsStarted: (...args: unknown[]) =>
        lessonMediaClipsStarted(...args),
    },
  }),
}));

const render = renderWithProviders();

describe("Copy link button", () => {
  it("renders", () => {
    const { getByText } = render(
      <LessonPlayAllButton
        lessonSlug="lesson-slug"
        unitSlug="unit-slug"
        programmeSlug="programme-slug"
        isCanonical={false}
      />,
    );

    expect(getByText("Play all")).toBeInTheDocument();
  });

  it("links to lesson media route", () => {
    const { getByText } = render(
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
    it("tracks lessonMediaClipsStarted when clicked", () => {
      const { getByText } = render(
        <LessonPlayAllButton
          lessonSlug="lesson-slug"
          unitSlug="unit-slug"
          programmeSlug="programme-slug"
          isCanonical={false}
        />,
      );

      const button = getByText("Play all");
      button.click();

      expect(lessonMediaClipsStarted).toHaveBeenCalledWith(
        expect.objectContaining({
          mediaClipsButtonName: "play all",
        }),
      );
    });
  });
});
