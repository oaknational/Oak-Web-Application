import sdk from "../../sdk";

import lessonListing from "./lessonListing.query";

describe("lessonListing()", () => {
  test("throws a not found error if no unit is found", async () => {
    await expect(async () => {
      await lessonListing({
        ...sdk,
        lessonListing: jest.fn(() => Promise.resolve({ unit: [] })),
      })({
        programmeSlug: "programme-slug",
        unitSlug: "unit-slug",
      });
    }).rejects.toThrow(`Resource not found`);
  });

  test("throws a Zod error if the response is invalid", async () => {
    await expect(async () => {
      await lessonListing({
        ...sdk,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        lessonListing: jest.fn(() =>
          Promise.resolve({
            unit: [
              {
                programmeSlug: "programme-slug",
                unitTitle: "unit-title",
                subjectSlug: "subject-slug",
                subjectTitle: "subject-title",
                keyStageSlug: "key-stage-slug",
                keyStageTitle: "key-stage-title",
                lessons: [],
              },
            ],
          }),
        ),
      })({
        programmeSlug: "programme-slug",
        unitSlug: "unit-slug",
      });
    }).rejects.toThrow(`lesson_slug`);
  });
});
