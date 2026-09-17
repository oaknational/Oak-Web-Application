import { extractLessonAccessedPropsFromHref } from "./extractLessonAccessedPropsFromHref";

describe("parseLessonUrl", () => {
  it("extracts the unit, lesson and key stage from a lesson href", () => {
    const result = extractLessonAccessedPropsFromHref(
      "https://thenational.academy/teachers/programmes/art-primary-ks1/units/mark-making-using-drawing-tools-and-techniques/lessons/lesson-slug?foo=bar",
    );
    expect(result).toEqual(
      expect.objectContaining({
        unitSlug: "mark-making-using-drawing-tools-and-techniques",
        lessonSlug: "lesson-slug",
        keyStageSlug: "ks1",
      }),
    );
  });

  it("returns null for unsupported hrefs", () => {
    expect(
      extractLessonAccessedPropsFromHref(
        "/teachers/programmes/art-primary/units/unit-slug",
      ),
    ).toBeNull();
  });
});
