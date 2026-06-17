import curriculumSequenceFilterDimensionsQuery from "./curriculumSequenceFilterDimensions.query";

describe("curriculumSequenceFilterDimensionsQuery", () => {
  it("fetches all boards in one query and groups filter dimensions by exam board", async () => {
    const curriculumSequenceFilterDimensionsMock = jest.fn(() =>
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

    const result = await curriculumSequenceFilterDimensionsQuery({
      curriculumSequenceFilterDimensions:
        curriculumSequenceFilterDimensionsMock,
    } as never)({
      subjectSlug: "science",
      phaseSlug: "secondary",
      examBoardSlugs: ["aqa", "edexcel"],
      includeNonCurriculum: true,
    });

    expect(curriculumSequenceFilterDimensionsMock).toHaveBeenCalledWith({
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
    expect(result).toEqual({
      aqa: {
        tierSlugs: ["foundation"],
        pathwaySlugs: [],
        childSubjectSlugs: ["biology"],
      },
      edexcel: {
        tierSlugs: ["higher"],
        pathwaySlugs: ["gcse"],
        childSubjectSlugs: [],
      },
    });
  });
});
