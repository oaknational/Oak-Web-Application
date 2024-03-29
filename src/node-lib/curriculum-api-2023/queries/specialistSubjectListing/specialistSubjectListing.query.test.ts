import sdk from "../../sdk";

import specialistSubjectListingQuery, {
  getExpandedSubjects,
  filterProgrammesBySubject,
  getBatchRequestVariables,
} from "./specialistSubjectListing.query";

jest.mock("../../sdk", () => {
  return {
    ...jest.requireActual("../../sdk"),
    getBatchedRequests: jest.fn(() =>
      Promise.resolve([
        {
          unitCount: { aggregate: { count: 0 } },
          lessonCount: { aggregate: { count: 0 } },
          programmeCount: { aggregate: { count: 0 } },
        },
      ]),
    ),
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
  };
});

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

describe("filterProgrammesBySubject", () => {
  test("it returns an empty array when no programmes provided", () => {
    const res = filterProgrammesBySubject([], []);

    expect(res.length).toBe(0);
  });
  test("it returns an empty array when no subjects provided", () => {
    const res = filterProgrammesBySubject(
      [
        {
          subjectSlug: "a",
          subjectTitle: "A",
          unitCount: 0,
          lessonCount: 0,
          programmeCount: 0,
        },
      ],
      [],
    );

    expect(res.length).toBe(0);
  });
  test("it returns correct programmes based on subjects", () => {
    const res = filterProgrammesBySubject(
      [
        {
          subjectSlug: "a",
          subjectTitle: "A",
          unitCount: 0,
          lessonCount: 0,
          programmeCount: 0,
        },
        {
          subjectSlug: "b",
          subjectTitle: "B",
          unitCount: 0,
          lessonCount: 0,
          programmeCount: 0,
        },
      ],
      [
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
      ],
    );
    expect(res.length).toBe(1);
    expect(res[0]?.subjectSlug).toBe("a");
  });
});

describe("getExpandedSubjects", () => {
  test("it throws an error when no corresponding data", () => {
    expect(() =>
      getExpandedSubjects(
        [
          { subjectSlug: "a", subjectTitle: "A" },
          { subjectSlug: "b", subjectTitle: "B" },
        ],
        [
          {
            data: {
              unitCount: { aggregate: { count: 0 } },
              lessonCount: { aggregate: { count: 0 } },
              programmeCount: { aggregate: { count: 0 } },
            },
          },
        ],
      ),
    ).toThrow();
  });
  test("it returns correct expanded subjects", () => {
    const res = getExpandedSubjects(
      [
        { subjectSlug: "a", subjectTitle: "A" },
        { subjectSlug: "b", subjectTitle: "B" },
      ],
      [
        {
          data: {
            unitCount: { aggregate: { count: 0 } },
            lessonCount: { aggregate: { count: 0 } },
            programmeCount: { aggregate: { count: 0 } },
          },
        },
        {
          data: {
            unitCount: { aggregate: { count: 0 } },
            lessonCount: { aggregate: { count: 0 } },
            programmeCount: { aggregate: { count: 0 } },
          },
        },
      ],
    );

    expect(res.length).toBe(2);
    expect(res[0]?.subjectSlug).toBe("a");
    expect(res[1]?.subjectSlug).toBe("b");
  });
});
