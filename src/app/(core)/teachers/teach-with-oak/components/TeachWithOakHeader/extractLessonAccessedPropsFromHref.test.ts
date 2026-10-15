import { extractLessonAccessedPropsFromHref } from "./extractLessonAccessedPropsFromHref";

describe("parseLessonUrl", () => {
  it("extracts the unit, lesson and key stage from a lesson href", () => {
    const result = extractLessonAccessedPropsFromHref({
      lessonName: "lesson name",
      unitName: "unit name",
      returnTo:
        "https://thenational.academy/teachers/programmes/art-primary-ks1/units/unitSlug/lessons/lessonSlug?foo=bar",
    });
    expect(result).toEqual(
      expect.objectContaining({
        lessonSlug: "lessonSlug",
        unitContext: expect.objectContaining({
          unitSlug: "unitSlug",
          keyStageSlug: "ks1",
        }),
      }),
    );
  });

  it("returns null for unsupported hrefs", () => {
    expect(
      extractLessonAccessedPropsFromHref({
        returnTo: "/teachers/programmes/art-primary/units/unit-slug",
        lessonName: "lesson name",
        unitName: "unit name",
      }),
    ).toBeNull();
  });
});
