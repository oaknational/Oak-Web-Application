import getNextLessonsInUnit from "./getNextLessonsInUnit";

import lessonListingFixture from "@/node-lib/curriculum-api/fixtures/lessonListing.fixture";

const lessons = lessonListingFixture().lessons;

describe("getNextLessonsInUnit()", () => {
  it("returns an empty array for an empty unit", async () => {
    expect(getNextLessonsInUnit([], "lesson-slug")).toEqual([]);
  });

  it("returns an empty array if the specified lesson is not in the unit", async () => {
    expect(getNextLessonsInUnit(lessons, "lesson-slug")).toEqual([]);
  });

  it("returns the next three lessons in the unit when the first lesson is found in a unit with more than three lessons", async () => {
    const nextLessons = getNextLessonsInUnit(lessons, "add-two-surds-6wwk0c");
    expect(nextLessons.length).toEqual(3);
    expect(nextLessons[0]?.lessonSlug).toEqual("subtract-two-surds-6njkac");
    expect(nextLessons[1]?.lessonSlug).toEqual(
      "subtract-two-surds-where-you-need-to-simplify-6gukce",
    );
    expect(nextLessons[2]?.lessonSlug).toEqual("subtract-three-surds");
  });

  it("returns the next two lessons when the lesson is the 3rd from the last in the unit", async () => {
    const nextLessons = getNextLessonsInUnit(
      lessons,
      "subtract-two-surds-where-you-need-to-simplify-6gukce",
    );
    expect(nextLessons.length).toEqual(2);
    expect(nextLessons[0]?.lessonSlug).toEqual("subtract-three-surds");
    expect(nextLessons[1]?.lessonSlug).toEqual("subtract-four-surds");
  });

  it("returns the next lesson when the lesson is the 2nd from the last in the unit", async () => {
    const nextLessons = getNextLessonsInUnit(lessons, "subtract-three-surds");
    expect(nextLessons.length).toEqual(1);
    expect(nextLessons[0]?.lessonSlug).toEqual("subtract-four-surds");
  });
  it("returns the next lesson when the lesson is the 1st and there are only 2 lessons in the unit", async () => {
    const nextLessons = getNextLessonsInUnit(
      lessons.splice(0, 2),
      "add-two-surds-6wwk0c",
    );
    expect(nextLessons.length).toEqual(1);
    expect(nextLessons[0]?.lessonSlug).toEqual("subtract-two-surds-6njkac");
  });
});
