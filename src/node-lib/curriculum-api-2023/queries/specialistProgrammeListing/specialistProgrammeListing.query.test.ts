import sdk from "../../sdk";

import specialistProgrammeListingQuery from "./specialistProgrammeListing.query";

jest.mock("../../sdk", () => {
  return {
    specialistProgrammeListing: jest.fn(() =>
      Promise.resolve({
        specialistProgrammeListing: [
          {
            synthetic_programme_slug: "creative-arts",
            combined_programme_fields: {
              subject: "Creative arts",
              subject_slug: "creative-arts",
              developmentstage: "Early development",
              developmentstage_slug: "early-development",
            },
          },
        ],
      }),
    ),
  };
});

describe("specialist programme listing", () => {
  test("it runs", async () => {
    const res = await specialistProgrammeListingQuery({
      ...sdk,
    })({ subjectSlug: "creative-arts" });

    expect(res).toBeDefined();
  });
  test("it throws an error if no programmes are found", async () => {
    await expect(async () => {
      await specialistProgrammeListingQuery({
        ...sdk,
        specialistProgrammeListing: jest.fn(() =>
          Promise.resolve({ specialistProgrammeListing: [] }),
        ),
      })({ subjectSlug: "creative-arts" });
    }).rejects.toThrow("curriculum-api/not-found");
  });
  test("it throws a zod error if the response is invalid", async () => {
    await expect(async () => {
      await specialistProgrammeListingQuery({
        ...sdk,
        specialistProgrammeListing: jest.fn(() =>
          Promise.resolve({ specialistProgrammeListing: [{}] }),
        ),
      })({ subjectSlug: "creative-arts" });
    }).rejects.toThrow("invalid");
  });
});
