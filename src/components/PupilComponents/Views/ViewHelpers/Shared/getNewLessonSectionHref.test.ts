import { getNewLessonSectionHref } from "./getNewLessonSectionHref";

describe("getNewLessonSectionHref", () => {
  it("builds a new lesson section href", () => {
    expect(
      getNewLessonSectionHref({
        lessonSlug: "lesson-slug",
        section: "video",
      }),
    ).toBe("/pupils/lessons/lesson-slug/new/video");
  });

  it("encodes lesson slugs and preserves non-section search params", () => {
    expect(
      getNewLessonSectionHref({
        lessonSlug: "lesson slug",
        section: "intro",
        searchParams: new URLSearchParams({
          section: "overview",
          assignment: "123",
        }),
      }),
    ).toBe("/pupils/lessons/lesson%20slug/new/intro?assignment=123");
  });
});
