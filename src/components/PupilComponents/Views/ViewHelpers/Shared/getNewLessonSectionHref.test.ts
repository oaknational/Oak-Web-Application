import { getNewLessonSectionHref } from "./getNewLessonSectionHref";

describe("getNewLessonSectionHref", () => {
  it("builds a new lesson section href", () => {
    expect(
      getNewLessonSectionHref({
        currentRoute: "/pupils/lessons/lesson-slug/new/overview",
        section: "video",
      }),
    ).toBe("/pupils/lessons/lesson-slug/new/video");
  });

  it("encodes lesson slugs and preserves non-section search params", () => {
    expect(
      getNewLessonSectionHref({
        currentRoute:
          "/pupils/lessons/lesson%20slug/new/video?section=overview&assignment=123",
        section: "intro",
        searchParams: new URLSearchParams({
          section: "overview",
          assignment: "123",
        }),
      }),
    ).toBe("/pupils/lessons/lesson%20slug/new/intro?assignment=123");
  });
});
