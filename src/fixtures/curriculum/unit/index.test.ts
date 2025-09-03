import { createThread } from "../thread";

import { createUnit, getKeystageSlug, getPhaseSlug, getPhaseTitle } from ".";

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
      prior_knowledge_requirements: [],
      national_curriculum_content: [],
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
      prior_knowledge_requirements: [],
      national_curriculum_content: [],
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
      prior_knowledge_requirements: [],
      national_curriculum_content: [],
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
      prior_knowledge_requirements: [],
      national_curriculum_content: [],
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
      prior_knowledge_requirements: [],
      national_curriculum_content: [],
    });
  });

  it("only phase_slug differs", () => {
    const result1 = createUnit({
      phase_slug: "secondary",
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
      phase: "Secondary",
      phase_slug: "secondary",
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
      prior_knowledge_requirements: [],
      national_curriculum_content: [],
    });
  });
});

describe("getPhaseTitle", () => {
  it("primary", () => {
    expect(getPhaseTitle("3")).toEqual("Primary");
  });

  it("secondary", () => {
    expect(getPhaseTitle("10")).toEqual("Secondary");
  });
});

describe("getPhaseSlug", () => {
  it("primary", () => {
    expect(getPhaseSlug("3")).toEqual("primary");
  });

  it("secondary", () => {
    expect(getPhaseSlug("10")).toEqual("secondary");
  });
});

describe("getKeystageSlug", () => {
  it("ks1", () => {
    expect(getKeystageSlug("1")).toEqual("ks1");
  });
  it("ks2", () => {
    expect(getKeystageSlug("6")).toEqual("ks2");
  });
  it("ks3", () => {
    expect(getKeystageSlug("7")).toEqual("ks3");
  });
  it("ks4", () => {
    expect(getKeystageSlug("10")).toEqual("ks4");
  });
});
