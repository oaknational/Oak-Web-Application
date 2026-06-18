import { buildExamboardFilterDimensions } from "./buildExamboardFilterDimensions";

describe("buildExamboardFilterDimensions", () => {
  it("groups filter dimensions per exam board including generic units", () => {
    const result = buildExamboardFilterDimensions(
      [
        {
          examboard_slug: "aqa",
          tier_slug: "foundation",
          pathway_slug: null,
          subject_slug: "biology",
          subject_parent_slug: "science",
        },
        {
          examboard_slug: null,
          tier_slug: "higher",
          pathway_slug: null,
          subject_slug: "biology",
          subject_parent_slug: "science",
        },
        {
          examboard_slug: "edexcel",
          tier_slug: "foundation",
          pathway_slug: "gcse",
          subject_slug: "biology",
          subject_parent_slug: null,
        },
      ],
      ["aqa", "edexcel"],
    );

    expect(result.aqa).toEqual({
      tierSlugs: ["foundation", "higher"],
      pathwaySlugs: [],
      childSubjectSlugs: ["biology"],
    });
    expect(result.edexcel).toEqual({
      tierSlugs: ["foundation", "higher"],
      pathwaySlugs: ["gcse"],
      childSubjectSlugs: ["biology"],
    });
  });

  it("returns empty dimension entries for each exam board when there are no units", () => {
    const result = buildExamboardFilterDimensions([], ["aqa", "edexcel"]);

    expect(result).toEqual({
      aqa: {
        tierSlugs: [],
        pathwaySlugs: [],
        childSubjectSlugs: [],
      },
      edexcel: {
        tierSlugs: [],
        pathwaySlugs: [],
        childSubjectSlugs: [],
      },
    });
  });
});
