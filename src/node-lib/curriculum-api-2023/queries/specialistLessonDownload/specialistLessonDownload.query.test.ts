import sdk from "../../sdk";

import { specialistLessonDownloadQuery } from "./specialistLessonDownload.query";

describe("specialistLessonDownload.query", () => {
  it("runs", async () => {
    const res = await specialistLessonDownloadQuery(sdk)({
      lessonSlug: "online-safety-c5gk8r",
      unitSlug: "staying-safe-al-5556",
      programmeSlug: "independent-living-applying-learning",
    });

    expect(res).toBeDefined();
  });
  it("throws an error if no lesson downloads are found", async () => {
    await expect(
      async () =>
        await specialistLessonDownloadQuery({
          ...sdk,
          specialistLessonListing: jest.fn(() =>
            Promise.resolve({
              specialistLessonListing: [],
            }),
          ),
        })({
          lessonSlug: "blah",
          unitSlug: "blah",
          programmeSlug: "fake-programme",
        }),
    ).rejects.toThrow("curriculum-api/not-found");
  });
  it.todo(
    "returns data in the shape of the specialist lesson download schema",
    // async () => {
    //   const res = await specialistLessonDownloadQuery(sdk)({
    //     lessonSlug: "online-safety-c5gk8r",
    //     unitSlug: "staying-safe-al-5556",
    //     programmeSlug: "independent-living-applying-learning",
    //   });
    //   expect(SpecialistLessonDownloadSchema.parse(res)).toEqual(res);
    //},
  );
});
