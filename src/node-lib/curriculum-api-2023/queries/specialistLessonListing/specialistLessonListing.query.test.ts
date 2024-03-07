import sdk from "../../sdk";

import specialistLessonListingQuery from "./specialistLessonListing.query";

describe("specialist programme listing", () => {
  test("it runs", async () => {
    const res = await specialistLessonListingQuery(sdk)({
      unitSlug: "staying-safe-al-5556",
      programmeSlug: "independent-living-applying-learning",
    });

    expect(res).toBeDefined();
  });
  test("it throws an error if no lessons are found", async () => {
    await expect(
      async () =>
        await specialistLessonListingQuery(sdk)({
          unitSlug: "blah",
          programmeSlug: "fake-programme",
        }),
    ).rejects.toThrow("curriculum-api/not-found");
  });
});
