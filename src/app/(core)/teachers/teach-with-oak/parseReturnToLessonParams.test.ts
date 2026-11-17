import { parseReturnToLessonParams } from "./parseReturnToLessonParams";

describe("parseReturnToLessonParams", () => {
  test("parses valid search params", () => {
    const result = parseReturnToLessonParams({
      returnTo: "/teachers/lessons/example",
      lessonName: "Lesson Name",
      unitName: "Unit Name",
      unrelated: "param",
    });

    expect(result).toEqual({
      returnTo: "/teachers/lessons/example",
      lessonName: "Lesson Name",
      unitName: "Unit Name",
    });
  });

  test.each([
    ["an invalid hostname", { returnTo: "https://google.com" }],
    ["missing params", {}],
    ["repeated params", { returnTo: ["/a", "/b"] }],
  ])("returns undefined for %s", (_, params) => {
    expect(
      parseReturnToLessonParams({
        lessonName: "Lesson Name",
        unitName: "Unit Name",
        ...params,
      }),
    ).toBeUndefined();
  });
});
