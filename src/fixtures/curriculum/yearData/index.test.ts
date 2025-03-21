import { createChildSubject } from "../childSubject";
import { createSubjectCategory } from "../subjectCategories";
import { createTier } from "../tier";
import { createUnit } from "../unit";

import { createYearData } from "./index";

describe("createSubjectCategory", () => {
  it("default year data", () => {
    const result = createYearData();
    expect(result).toEqual({
      units: [],
      childSubjects: [],
      subjectCategories: [],
      tiers: [],
      pathways: [],
      isSwimming: false,
      groupAs: null,
    });
  });

  it("pass data", () => {
    const result = createYearData({
      units: [createUnit({ slug: "test" })],
      childSubjects: [createChildSubject({ subject_slug: "test" })],
      subjectCategories: [createSubjectCategory({ id: 2 })],
      tiers: [createTier({ tier_slug: "test" })],
      pathways: [],
      isSwimming: true,
      groupAs: "testing_group",
    });
    expect(result).toEqual({
      units: [
        {
          connection_future_unit_description: null,
          connection_future_unit_title: null,
          connection_prior_unit_description: null,
          connection_prior_unit_title: null,
          cycle: "1",
          description: null,
          domain: null,
          domain_id: null,
          examboard: null,
          examboard_slug: null,
          keystage_slug: "ks2",
          lessons: [],
          order: 0,
          phase: "Primary",
          phase_slug: "primary",
          planned_number_of_lessons: null,
          slug: "test",
          state: "published",
          subject: "Transfiguration",
          subject_parent: null,
          subject_parent_slug: null,
          subject_slug: "transfiguration",
          subjectcategories: null,
          tags: null,
          threads: [],
          tier: null,
          tier_slug: null,
          title: "Test",
          unit_options: [],
          why_this_why_now: null,
          year: "5",
        },
      ],
      childSubjects: [
        {
          subject: "Test",
          subject_slug: "test",
        },
      ],
      subjectCategories: [
        {
          id: 2,
          title: "Foo",
        },
      ],
      tiers: [
        {
          tier: "Test",
          tier_slug: "test",
        },
      ],
      pathways: [],
      isSwimming: true,
      groupAs: "testing_group",
    });
  });
});
