import sdk from "../../sdk";

import programmeListing from "./programmeListing.query";

describe("programmeListing()", () => {
  test("throws a not found error if programme is not found", async () => {
    await expect(async () => {
      await programmeListing({
        ...sdk,
        programmeListing: jest.fn(() => Promise.resolve({ programmes: [] })),
      })({
        keyStageSlug: "key-stage-slug",
        subjectSlug: "subject-slug",
      });
    }).rejects.toThrow(`Resource not found`);
  });

  test("throws a Zod error if the response is invalid", async () => {
    await expect(async () => {
      await programmeListing({
        ...sdk,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        programmeListing: jest.fn(() =>
          Promise.resolve({
            programmes: [
              {
                keyStageSlug: "ks3",
                // subjectSlug: "maths", // <-- missing
                programmes: [
                  {
                    programmeSlug: "maths-secondary-ks4-core",
                    subjectTitle: "Maths",
                    unitCount: 61,
                    lessonCount: 284,
                    tierSlug: "core",
                    tierTitle: "Core",
                  },
                  {
                    programmeSlug: "maths-secondary-ks4-foundation",
                    subjectTitle: "Maths",
                    unitCount: 63,
                    lessonCount: 256,
                    tierSlug: "foundation",
                    tierTitle: "Foundation",
                  },
                  {
                    programmeSlug: "maths-secondary-ks4-higher",
                    subjectTitle: "Maths",
                    unitCount: 63,
                    lessonCount: 275,
                    tierSlug: "higher",
                    tierTitle: "Higher",
                  },
                ],
              },
            ],
          })
        ),
      })({
        keyStageSlug: "key-stage-slug",
        subjectSlug: "subject-slug",
      });
    }).rejects.toThrow(`subjectSlug`);
  });
});
