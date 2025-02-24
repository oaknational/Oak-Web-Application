import { createThread } from "../thread";

import { createUnit } from ".";

describe("createUnit", () => {
  it("basic", () => {
    const result = createUnit();

    expect(result).toEqual({
      connection_prior_unit_description: null,
      connection_future_unit_description: null,
      connection_future_unit_title: null,
      connection_prior_unit_title: null,
      domain: null,
      domain_id: null,
      examboard: null,
      examboard_slug: null,
      planned_number_of_lessons: null,
      phase: "Primary",
      phase_slug: "primary",
      keystage_slug: "ks2",
      slug: "test",
      title: "Test",
      lessons: [],
      order: 0,
      subject: "Transfiguration",
      subject_slug: "transfiguration",
      subject_parent: null,
      subject_parent_slug: null,
      tier: null,
      tier_slug: null,
      tags: null,
      subjectcategories: null,
      threads: [],
      description: null,
      why_this_why_now: null,
      cycle: "1",
      unit_options: [],
      state: "published",
      year: "5",
    });
  });

  it("with overrides", () => {
    const result = createUnit({
      slug: "plain-transfiguration",
      title: "Plain Transfiguration",
    });

    expect(result).toEqual({
      connection_prior_unit_description: null,
      connection_future_unit_description: null,
      connection_future_unit_title: null,
      connection_prior_unit_title: null,
      domain: null,
      domain_id: null,
      examboard: null,
      examboard_slug: null,
      planned_number_of_lessons: null,
      phase: "Primary",
      phase_slug: "primary",
      keystage_slug: "ks2",
      slug: "plain-transfiguration",
      title: "Plain Transfiguration",
      lessons: [],
      order: 0,
      subject: "Transfiguration",
      subject_slug: "transfiguration",
      subject_parent: null,
      subject_parent_slug: null,
      tier: null,
      tier_slug: null,
      tags: null,
      subjectcategories: null,
      threads: [],
      description: null,
      why_this_why_now: null,
      cycle: "1",
      unit_options: [],
      state: "published",
      year: "5",
    });
  });

  it("with only slug override", () => {
    const result = createUnit({
      slug: "plain-transfiguration",
    });

    expect(result).toEqual({
      connection_prior_unit_description: null,
      connection_future_unit_description: null,
      connection_future_unit_title: null,
      connection_prior_unit_title: null,
      domain: null,
      domain_id: null,
      examboard: null,
      examboard_slug: null,
      planned_number_of_lessons: null,
      phase: "Primary",
      phase_slug: "primary",
      keystage_slug: "ks2",
      slug: "plain-transfiguration",
      title: "Plain transfiguration",
      lessons: [],
      order: 0,
      subject: "Transfiguration",
      subject_slug: "transfiguration",
      subject_parent: null,
      subject_parent_slug: null,
      tier: null,
      tier_slug: null,
      tags: null,
      subjectcategories: null,
      threads: [],
      description: null,
      why_this_why_now: null,
      cycle: "1",
      unit_options: [],
      state: "published",
      year: "5",
    });
  });

  it("can override generated args", () => {
    const result = createUnit({
      phase: "Secondary",
      phase_slug: "secondary",
      keystage_slug: "ks3",
      year: "5",
    });

    expect(result).toEqual({
      connection_prior_unit_description: null,
      connection_future_unit_description: null,
      connection_future_unit_title: null,
      connection_prior_unit_title: null,
      domain: null,
      domain_id: null,
      examboard: null,
      examboard_slug: null,
      planned_number_of_lessons: null,
      phase: "Secondary",
      phase_slug: "secondary",
      keystage_slug: "ks3",
      slug: "test",
      title: "Test",
      lessons: [],
      order: 0,
      subject: "Transfiguration",
      subject_slug: "transfiguration",
      subject_parent: null,
      subject_parent_slug: null,
      tier: null,
      tier_slug: null,
      tags: null,
      subjectcategories: null,
      threads: [],
      description: null,
      why_this_why_now: null,
      cycle: "1",
      unit_options: [],
      state: "published",
      year: "5",
    });
  });

  it("with threads", () => {
    const result1 = createUnit({
      threads: [createThread()],
    });

    expect(result1).toEqual({
      connection_prior_unit_description: null,
      connection_future_unit_description: null,
      connection_future_unit_title: null,
      connection_prior_unit_title: null,
      domain: null,
      domain_id: null,
      examboard: null,
      examboard_slug: null,
      planned_number_of_lessons: null,
      phase: "Primary",
      phase_slug: "primary",
      keystage_slug: "ks2",
      slug: "test",
      title: "Test",
      lessons: [],
      order: 0,
      subject: "Transfiguration",
      subject_slug: "transfiguration",
      subject_parent: null,
      subject_parent_slug: null,
      tier: null,
      tier_slug: null,
      tags: null,
      subjectcategories: null,
      threads: [
        {
          title: "Test",
          slug: "test",
          order: 1,
        },
      ],
      description: null,
      why_this_why_now: null,
      cycle: "1",
      unit_options: [],
      state: "published",
      year: "5",
    });
  });
});
