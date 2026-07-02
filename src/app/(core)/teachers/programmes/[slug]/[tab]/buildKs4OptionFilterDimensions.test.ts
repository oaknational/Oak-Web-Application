import { buildKs4OptionFilterDimensions } from "./buildKs4OptionFilterDimensions";

describe("buildKs4OptionFilterDimensions", () => {
  it("groups filter dimensions per exam board including generic units", () => {
    const result = buildKs4OptionFilterDimensions(
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

  it("returns empty dimension entries for each option when there are no units", () => {
    const result = buildKs4OptionFilterDimensions([], ["aqa", "edexcel"]);

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

  it("groups filter dimensions per pathway option for citizenship", () => {
    const result = buildKs4OptionFilterDimensions(
      [
        {
          examboard_slug: null,
          tier_slug: null,
          pathway_slug: "core",
          subject_slug: "citizenship",
          subject_parent_slug: null,
        },
        {
          examboard_slug: null,
          tier_slug: null,
          pathway_slug: "gcse",
          subject_slug: "citizenship",
          subject_parent_slug: null,
        },
        {
          examboard_slug: null,
          tier_slug: null,
          pathway_slug: null,
          subject_slug: "citizenship",
          subject_parent_slug: null,
        },
      ],
      ["core", "gcse"],
    );

    expect(result.core).toEqual({
      tierSlugs: [],
      pathwaySlugs: ["core"],
      childSubjectSlugs: [],
    });
    expect(result.gcse).toEqual({
      tierSlugs: [],
      pathwaySlugs: ["gcse"],
      childSubjectSlugs: [],
    });
  });

  it("excludes core units from non-core pathway and exam board options for computing", () => {
    const result = buildKs4OptionFilterDimensions(
      [
        {
          examboard_slug: null,
          tier_slug: null,
          pathway_slug: "core",
          subject_slug: "computing",
          subject_parent_slug: null,
        },
        {
          examboard_slug: "aqa",
          tier_slug: null,
          pathway_slug: "gcse",
          subject_slug: "computing",
          subject_parent_slug: null,
        },
        {
          examboard_slug: "ocr",
          tier_slug: null,
          pathway_slug: null,
          subject_slug: "computing",
          subject_parent_slug: null,
        },
      ],
      ["core", "aqa", "ocr"],
    );

    expect(result.core).toEqual({
      tierSlugs: [],
      pathwaySlugs: ["core"],
      childSubjectSlugs: [],
    });
    expect(result.aqa).toEqual({
      tierSlugs: [],
      pathwaySlugs: ["gcse"],
      childSubjectSlugs: [],
    });
    expect(result.ocr).toEqual({
      tierSlugs: [],
      pathwaySlugs: [],
      childSubjectSlugs: [],
    });
  });
});
