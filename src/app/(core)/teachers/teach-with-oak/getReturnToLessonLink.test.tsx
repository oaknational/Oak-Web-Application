import { ReadonlyURLSearchParams } from "next/navigation";

import {
  getReturnToLessonProps,
  parseReturnToLessonParams,
} from "./getReturnToLessonLink";

const createQuery = (returnTo: string) =>
  new URLSearchParams({
    returnTo,
    lessonName: "Lesson Name",
    unitName: "Unit Name",
  }) as ReadonlyURLSearchParams;

describe("getReturnToLessonLink", () => {
  test("creates a valid link", () => {
    const result = getReturnToLessonProps({
      query: createQuery("/teachers/lessons/example"),
    });

    expect(result?.returnTo).toEqual("/teachers/lessons/example");
  });

  test("does not pass a return link from an invalid hostname to the view", () => {
    const result = getReturnToLessonProps({
      query: createQuery("https://google.com"),
    });

    expect(result).toBeUndefined();
  });
});

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
