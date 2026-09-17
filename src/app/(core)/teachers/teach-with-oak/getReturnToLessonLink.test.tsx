import { ReadonlyURLSearchParams } from "next/navigation";

import { getReturnToLessonLink } from "./getReturnToLessonLink";

const createQuery = (returnTo: string) =>
  new URLSearchParams({ returnTo }) as ReadonlyURLSearchParams;

describe("getReturnToLessonLink", () => {
  test("creates a valid link", () => {
    const result = getReturnToLessonLink({
      query: createQuery(
        "https://thenational.academy/teachers/lessons/example",
      ),
    });

    expect(result).toEqual(
      "https://thenational.academy/teachers/lessons/example",
    );
  });

  test("does not pass a return link from an invalid hostname to the view", () => {
    const result = getReturnToLessonLink({
      query: createQuery("https://google.com"),
    });

    expect(result).toBeUndefined();
  });
});
