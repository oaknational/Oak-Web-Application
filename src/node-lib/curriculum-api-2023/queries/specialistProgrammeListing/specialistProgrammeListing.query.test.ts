import sdk from "../../sdk";

import specialistProgrammeListingQuery, {
  transformProgrammes,
} from "./specialistProgrammeListing.query";

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
    specialistProgrammeListingCounts: jest.fn(() =>
      Promise.resolve({
        unitCount: { aggregate: { count: 1 } },
        lessonCount: { aggregate: { count: 12 } },
      }),
    ),
    getBatchedRequests: jest.fn(() =>
      Promise.resolve([
        {
          data: {
            unitCount: { aggregate: { count: 1 } },
            lessonCount: { aggregate: { count: 12 } },
          },
        },
        {
          data: {
            unitCount: { aggregate: { count: 2 } },
            lessonCount: { aggregate: { count: 24 } },
          },
        },
        {
          data: {
            unitCount: { aggregate: { count: 3 } },
            lessonCount: { aggregate: { count: 36 } },
          },
        },
      ]),
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

const queryResponse = [
  {
    synthetic_programme_slug: "creative-arts",
    combined_programme_fields: {
      subject: "Creative arts",
      subject_slug: "creative-arts",
      developmentstage: "Early development",
      developmentstage_slug: "early-development",
      developmentstage_display_order: 3,
    },
  },
  {
    synthetic_programme_slug: "creative-arts",
    combined_programme_fields: {
      subject: "Creative arts",
      subject_slug: "creative-arts",
      developmentstage: "Applying Learning",
      developmentstage_slug: "applying-learning",
      developmentstage_display_order: 1,
    },
  },
  {
    synthetic_programme_slug: "creative-arts",
    combined_programme_fields: {
      subject: "Creative arts",
      subject_slug: "creative-arts",
      developmentstage: "Building Understanding",
      developmentstage_slug: "building-understanding",
      developmentstage_display_order: 2,
    },
  },
];

describe("transform programms", () => {
  test("transforms data", async () => {
    const res = await transformProgrammes(queryResponse);

    expect(res.subjectSlug).toBe("creative-arts");
    expect(res.subjectTitle).toBe("Creative arts");
    expect(res.programmes.length).toBe(3);
  });
  test("fetches counts and applies to programmes", async () => {
    const res = await transformProgrammes(queryResponse);
    const programmes = res.programmes;

    programmes.forEach((p) => expect(p.unitCount).toBeDefined());
  });
});
