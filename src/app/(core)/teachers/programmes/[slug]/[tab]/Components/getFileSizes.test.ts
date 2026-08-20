import { getFileSizes } from "./getFileSizes";

jest.mock("@/pages/api/curriculum-downloads", () => {
  const originalModule = jest.requireActual("@/pages/api/curriculum-downloads");
  return {
    __esModule: true,
    ...originalModule,
    getFileSize: jest.fn(async ({ childSubjectSlug, tierSlug }) => {
      const childsubjectWeights = {
        biology: 1000,
        chemistry: 2000,
        physics: 3000,
      };
      const tierWeights = {
        foundation: 100,
        higher: 200,
      };
      const childSubjectWeight = childSubjectSlug
        ? (childsubjectWeights[
            childSubjectSlug as keyof typeof childsubjectWeights
          ] ?? 0)
        : 0;
      const tierWeight = tierSlug
        ? (tierWeights[tierSlug as keyof typeof tierWeights] ?? 0)
        : 0;
      return childSubjectWeight + tierWeight;
    }),
  };
});

describe("getFileSizes", () => {
  it("should return sizes", async () => {
    const results = await getFileSizes(
      {
        subjectSlug: "science",
        phaseSlug: "secondary",
        ks4OptionSlug: null,
      },
      {
        tiers: [],
        child_subjects: [],
      },
    );

    expect(results).toEqual([
      {
        downloadId: "curriculumPlans",
        size: 0,
        tier: null,
        childSubject: null,
      },
      {
        downloadId: "nationalCurriculum",
        size: 0,
        tier: null,
        childSubject: null,
      },
    ]);
  });
  it("should return sizes (tier)", async () => {
    const results = await getFileSizes(
      {
        subjectSlug: "science",
        phaseSlug: "secondary",
        ks4OptionSlug: null,
      },
      {
        tiers: [
          {
            tier_slug: "foundation",
            tier: "Foundation",
          },
          {
            tier_slug: "higher",
            tier: "Higher",
          },
        ],
        child_subjects: [],
      },
    );

    expect(results).toEqual([
      {
        downloadId: "curriculumPlans",
        size: 100,
        tier: "foundation",
        childSubject: null,
      },
      {
        downloadId: "curriculumPlans",
        size: 200,
        tier: "higher",
        childSubject: null,
      },
      {
        downloadId: "nationalCurriculum",
        size: 100,
        tier: "foundation",
        childSubject: null,
      },
      {
        downloadId: "nationalCurriculum",
        size: 200,
        tier: "higher",
        childSubject: null,
      },
    ]);
  });
  it("should return sizes (childsubjects + tier)", async () => {
    const results = await getFileSizes(
      {
        subjectSlug: "science",
        phaseSlug: "secondary",
        ks4OptionSlug: null,
      },
      {
        tiers: [
          {
            tier_slug: "foundation",
            tier: "Foundation",
          },
          {
            tier_slug: "higher",
            tier: "Higher",
          },
        ],
        child_subjects: [
          {
            subject_slug: "biology",
            subject: "Biology",
          },
          {
            subject_slug: "chemistry",
            subject: "Chemistry",
          },
          {
            subject_slug: "physics",
            subject: "Physics",
          },
        ],
      },
    );

    expect(results).toEqual([
      {
        downloadId: "curriculumPlans",
        size: 1100,
        tier: "foundation",
        childSubject: "biology",
      },
      {
        downloadId: "curriculumPlans",
        size: 1200,
        tier: "higher",
        childSubject: "biology",
      },
      {
        downloadId: "curriculumPlans",
        size: 2100,
        tier: "foundation",
        childSubject: "chemistry",
      },
      {
        downloadId: "curriculumPlans",
        size: 2200,
        tier: "higher",
        childSubject: "chemistry",
      },
      {
        downloadId: "curriculumPlans",
        size: 3100,
        tier: "foundation",
        childSubject: "physics",
      },
      {
        downloadId: "curriculumPlans",
        size: 3200,
        tier: "higher",
        childSubject: "physics",
      },
      {
        downloadId: "nationalCurriculum",
        size: 1100,
        tier: "foundation",
        childSubject: "biology",
      },
      {
        downloadId: "nationalCurriculum",
        size: 1200,
        tier: "higher",
        childSubject: "biology",
      },
      {
        downloadId: "nationalCurriculum",
        size: 2100,
        tier: "foundation",
        childSubject: "chemistry",
      },
      {
        downloadId: "nationalCurriculum",
        size: 2200,
        tier: "higher",
        childSubject: "chemistry",
      },
      {
        downloadId: "nationalCurriculum",
        size: 3100,
        tier: "foundation",
        childSubject: "physics",
      },
      {
        downloadId: "nationalCurriculum",
        size: 3200,
        tier: "higher",
        childSubject: "physics",
      },
    ]);
  });
});
