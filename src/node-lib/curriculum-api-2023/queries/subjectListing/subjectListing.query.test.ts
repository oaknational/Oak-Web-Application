import sdk from "../../sdk";

import subjectListing from "./subjectListing.query";

describe("subjectListing()", () => {
  test("throws a not found error if no subjects are found", async () => {
    await expect(async () => {
      await subjectListing({
        ...sdk,
        subjectListing: jest.fn(() =>
          Promise.resolve({ keyStageSubjects: [] })
        ),
      })({
        keyStageSlug: "key-stage-slug",
      });
    }).rejects.toThrow(`Resource not found`);
  });

  test("throws a Zod error if the response is invalid", async () => {
    await expect(async () => {
      await subjectListing({
        ...sdk,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        lessonListing: jest.fn(() =>
          Promise.resolve({
            keyStageSubjects: [
              {
                programmeSlug: "programme-slug",
              },
            ],
          })
        ),
      })({
        keyStageSlug: "maths",
      });
    }).rejects.toThrow(`Resource not found`);
  });
});
