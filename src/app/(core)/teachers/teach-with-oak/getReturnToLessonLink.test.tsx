import { ReadonlyURLSearchParams } from "next/navigation";

import { getReturnToLessonProps } from "./getReturnToLessonLink";

const createQuery = (returnTo: string) =>
  new URLSearchParams({
    returnTo,
    lessonName: "Lesson Name",
    unitName: "Unit Name",
  }) as ReadonlyURLSearchParams;

describe("getReturnToLessonLink", () => {
  test("creates a valid link", () => {
    const result = getReturnToLessonProps({
      query: createQuery(
        "https://thenational.academy/teachers/lessons/example",
      ),
    });

    expect(result?.returnTo).toEqual(
      "https://thenational.academy/teachers/lessons/example",
    );
  });

  test("does not pass a return link from an invalid hostname to the view", () => {
    const result = getReturnToLessonProps({
      query: createQuery("https://google.com"),
    });

    expect(result).toBeUndefined();
  });
});
