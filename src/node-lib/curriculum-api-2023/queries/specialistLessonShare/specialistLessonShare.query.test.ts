import sdk from "../../sdk";

import { specialistLessonShareQuery } from "./specialistLessonShare.query";

describe("specialistLessonShare.query", () => {
  it("runs", async () => {
    const res = await specialistLessonShareQuery(sdk)({
      lessonSlug: "online-safety-c5gk8r",
      unitSlug: "staying-safe-al-5556",
      programmeSlug: "independent-living-applying-learning",
    });

    expect(res).toBeDefined();
  });
  it("throws an error if no lesson is found", async () => {
    await expect(
      async () =>
        await specialistLessonShareQuery({
          ...sdk,
          specialistLessonShare: jest.fn(() =>
            Promise.resolve({
              specialistLessonShare: [],
            }),
          ),
        })({
          lessonSlug: "blah",
          unitSlug: "blah",
          programmeSlug: "fake-programme",
        }),
    ).rejects.toThrow("curriculum-api/not-found");
  });
  it.todo("returns data in the shape of the specialist lesson share schema");
});
