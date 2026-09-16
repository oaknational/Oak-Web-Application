import { extractLessonPropsFromHref } from "./extractLessonPropsFromHref";

describe("parseLessonUrl", () => {
  it("extracts the unit, lesson and key stage from a lesson href", () => {
    expect(
      extractLessonPropsFromHref(
        "https://thenational.academy/teachers/programmes/art-primary-ks1/units/mark-making-using-drawing-tools-and-techniques/lessons/lesson-slug?foo=bar",
      ),
    ).toEqual({
      unitSlug: "mark-making-using-drawing-tools-and-techniques",
      lessonSlug: "lesson-slug",
      keyStageSlug: "ks1",
    });
  });

  it("returns null for unsupported hrefs", () => {
    expect(
      extractLessonPropsFromHref(
        "/teachers/programmes/art-primary/units/unit-slug",
      ),
    ).toBeNull();
  });
});
