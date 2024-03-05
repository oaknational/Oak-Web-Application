import sdk from "../../sdk";

import specialistSubjectListingQuery, {
  getBatchRequestVariables,
} from "./specialistSubjectListing.query";

jest.mock("../../generated/sdk", () => ({
  __esModule: true,
  getSdk: () => ({
    specialistSubjectListing: jest.fn(() =>
      Promise.resolve({ therapyProgrammes: [], specialistProgrammes: [] }),
    ),
    specialistUnitsAndLessonCount: jest.fn(() =>
      Promise.resolve({
        unitCount: { aggregate: { count: 0 } },
        lessonCount: { aggregate: { count: 0 } },
        programmeCount: { aggregate: { count: 0 } },
      }),
    ),
    batchRequests: jest.fn(() =>
      Promise.resolve([
        {
          unitCount: { aggregate: { count: 0 } },
          lessonCount: { aggregate: { count: 0 } },
          programmeCount: { aggregate: { count: 0 } },
        },
      ]),
    ),
  }),
}));

describe("specialist subject listing", () => {
  test("it runs", async () => {
    const res = await specialistSubjectListingQuery({
      ...sdk,
    })();

    expect(res).toBeDefined();
  });
});

describe("getBatchRequestVariables", () => {
  test("it returns a unique list of subjects", () => {
    const res = getBatchRequestVariables([
      {
        combined_programme_fields: {
          subject_slug: "a",
          subject_parent: "specialist",
          subject_type: "specialist",
          developmentstage: "Early Development",
          developmentstage_slug: "early-development",
          subject: "A",
        },
      },
      {
        combined_programme_fields: {
          subject_slug: "a",
          subject_parent: "specialist",
          subject_type: "specialist",
          developmentstage: "Building Understanding",
          developmentstage_slug: "building-understanding",
          subject: "A",
        },
      },
      {
        combined_programme_fields: {
          subject_slug: "b",
          subject_parent: "therapies",
          subject_type: "specialist",
          developmentstage: null,
          developmentstage_slug: null,
          subject: "B",
        },
      },
    ]);

    const subjects = res.map((r) => r.subjectSlug);

    subjects.forEach((s, i) => {
      expect(subjects.indexOf(s)).toBe(i);
    });
  });
});
