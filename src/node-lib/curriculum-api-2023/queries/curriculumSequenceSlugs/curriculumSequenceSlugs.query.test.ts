import curriculumSequenceSlugsQuery from "./curriculumSequenceSlugs.query";

describe("curriculumSequenceSlugsQuery", () => {
  it("fetches slug fields for all units in a subject and phase", async () => {
    const curriculumSequenceSlugsMock = jest.fn(() =>
      Promise.resolve({
        units: [
          {
            examboard_slug: "aqa",
            tier_slug: "foundation",
            pathway_slug: null,
            subject_slug: "biology",
            subject_parent_slug: "science",
          },
          {
            examboard_slug: "edexcel",
            tier_slug: "higher",
            pathway_slug: "gcse",
            subject_slug: "biology",
            subject_parent_slug: null,
          },
        ],
      }),
    );

    const result = await curriculumSequenceSlugsQuery({
      curriculumSequenceSlugs: curriculumSequenceSlugsMock,
    } as never)({
      subjectSlug: "science",
      phaseSlug: "secondary",
      includeNonCurriculum: true,
    });

    expect(curriculumSequenceSlugsMock).toHaveBeenCalledWith({
      where: {
        _and: [
          {
            _or: [
              { subject_slug: { _eq: "science" } },
              { subject_parent_slug: { _eq: "science" } },
            ],
          },
          { phase_slug: { _eq: "secondary" } },
          { state: { _eq: "published" } },
        ],
      },
    });
    expect(result).toEqual([
      {
        examboard_slug: "aqa",
        tier_slug: "foundation",
        pathway_slug: null,
        subject_slug: "biology",
        subject_parent_slug: "science",
      },
      {
        examboard_slug: "edexcel",
        tier_slug: "higher",
        pathway_slug: "gcse",
        subject_slug: "biology",
        subject_parent_slug: null,
      },
    ]);
  });
});
