import {
  createProgrammeSlug,
  getKs4RedirectSlug,
  isValidSubjectPhaseSlug,
  KS4_EXAMBOARD_PREFERENCE,
  parseSubjectPhaseSlug,
} from "./slugs";

import { SubjectPhaseOptions } from "@/node-lib/curriculum-api-2023/queries/curriculumPhaseOptions/curriculumPhaseOptions.query";

describe("parseSubjectPhaseSlug", () => {
  it("should extract from a valid slug", () => {
    const slug = "english-secondary-aqa";
    const parsed = parseSubjectPhaseSlug(slug);
    expect(parsed).toEqual({
      subjectSlug: "english",
      phaseSlug: "secondary",
      ks4OptionSlug: "aqa",
    });
  });

  it("should reject an invalid slug", () => {
    const slug = "not_a_valid_slug";
    const parsed = parseSubjectPhaseSlug(slug);
    expect(parsed).toEqual(undefined);
  });
});

const testSubjectPhaseOptions: SubjectPhaseOptions = [
  {
    title: "English",
    slug: "english",
    phases: [
      { title: "Primary", slug: "primary" },
      { title: "Secondary", slug: "secondary" },
    ],
    ks4_options: [
      { title: "AQA", slug: "aqa" },
      { title: "Edexcel", slug: "edexcel" },
    ],
    keystages: [
      { title: "KS1", slug: "ks1" },
      { title: "KS3", slug: "ks3" },
    ],
  },
];

describe("isValidSubjectPhaseSlug", () => {
  it("valid to return true", () => {
    expect(
      isValidSubjectPhaseSlug(testSubjectPhaseOptions, {
        phaseSlug: "primary",
        subjectSlug: "english",
        ks4OptionSlug: null,
      }),
    ).toEqual(true);

    expect(
      isValidSubjectPhaseSlug(testSubjectPhaseOptions, {
        phaseSlug: "secondary",
        subjectSlug: "english",
        ks4OptionSlug: "aqa",
      }),
    ).toEqual(true);
  });

  it("invalid to return false", () => {
    expect(
      isValidSubjectPhaseSlug(testSubjectPhaseOptions, {
        phaseSlug: "foo",
        subjectSlug: "english",
        ks4OptionSlug: null,
      }),
    ).toEqual(false);

    expect(
      isValidSubjectPhaseSlug(testSubjectPhaseOptions, {
        phaseSlug: "secondary",
        subjectSlug: "english",
        ks4OptionSlug: null,
      }),
    ).toEqual(false);
  });
});

describe("getKs4RedirectSlug", () => {
  it("return undefined if ks4OptionSlug specified", () => {
    expect(
      getKs4RedirectSlug(testSubjectPhaseOptions, {
        subjectSlug: "english",
        phaseSlug: "secondary",
        ks4OptionSlug: "aqa",
      }),
    ).toEqual(undefined);
  });

  it("return undefined if no match", () => {
    expect(
      getKs4RedirectSlug(testSubjectPhaseOptions, {
        subjectSlug: "test",
        phaseSlug: "secondary",
        ks4OptionSlug: null,
      }),
    ).toEqual(undefined);
  });

  it("return correct default when specified", () => {
    expect(
      getKs4RedirectSlug(testSubjectPhaseOptions, {
        subjectSlug: "english",
        phaseSlug: "secondary",
        ks4OptionSlug: null,
      }),
    ).toEqual({
      subjectSlug: "english",
      phaseSlug: "secondary",
      ks4OptionSlug: KS4_EXAMBOARD_PREFERENCE["english"],
    });
  });
});

describe("createProgrammeSlug", () => {
  test("unit data ks2 returns correct programme slug", () => {
    const unitData = {
      planned_number_of_lessons: 5,
      connection_future_unit_description: null,
      connection_prior_unit_description: null,
      connection_future_unit_title: null,
      connection_prior_unit_title: null,
      domain: null,
      domain_id: null,
      examboard: null,
      examboard_slug: null,
      keystage_slug: "ks2",
      lessons: [],
      order: 1,
      phase: "Primary",
      phase_slug: "primary",
      slug: "cellular-respiration-and-atp",
      subject: "Science",
      subject_parent: null,
      subject_parent_slug: null,
      subject_slug: "science",
      tags: null,
      subjectcategories: null,
      threads: [],
      tier: null,
      tier_slug: null,
      title: "Aerobic and anaerobic cellular respiration",
      unit_options: [],
      year: "11",
      cycle: "1",
      why_this_why_now: null,
      description: null,
      state: "published",
    };
    expect(createProgrammeSlug(unitData)).toEqual("science-primary-ks2");
  });
  test("unit data ks4 returns correct programme slug", () => {
    const unitData = {
      planned_number_of_lessons: 5,
      connection_future_unit_description: null,
      connection_prior_unit_description: null,
      connection_future_unit_title: null,
      connection_prior_unit_title: null,
      domain: null,
      domain_id: null,
      examboard: null,
      examboard_slug: null,
      keystage_slug: "ks4",
      lessons: [],
      order: 1,
      phase: "Primary",
      phase_slug: "primary",
      slug: "cellular-respiration-and-atp",
      subject: "Science",
      subject_parent: null,
      subject_parent_slug: null,
      subject_slug: "science",
      tags: null,
      subjectcategories: null,
      threads: [],
      tier: null,
      tier_slug: null,
      title: "Aerobic and anaerobic cellular respiration",
      unit_options: [],
      year: "11",
      cycle: "1",
      why_this_why_now: null,
      description: null,
      state: "published",
    };
    expect(createProgrammeSlug(unitData)).toEqual("science-primary-ks4");
  });
  test("unit data with exam board and tier returns the correct programme slug", () => {
    const unitData = {
      planned_number_of_lessons: 5,
      connection_future_unit_description: null,
      connection_prior_unit_description: null,
      connection_future_unit_title: null,
      connection_prior_unit_title: null,
      domain: null,
      domain_id: null,
      examboard: null,
      examboard_slug: null,
      keystage_slug: "ks4",
      lessons: [],
      order: 1,
      phase: "Secondary",
      phase_slug: "secondary",
      slug: "cellular-respiration-and-atp",
      subject: "Combined Science",
      subject_parent: "Science",
      subject_parent_slug: "science",
      subject_slug: "combined-science",
      tags: null,
      subjectcategories: null,
      threads: [],
      tier: null,
      tier_slug: null,
      title: "Aerobic and anaerobic cellular respiration",
      unit_options: [],
      year: "11",
      cycle: "1",
      why_this_why_now: null,
      description: null,
      state: "published",
    };
    expect(createProgrammeSlug(unitData, "aqa", "foundation")).toEqual(
      "combined-science-secondary-ks4-foundation-aqa",
    );
  });
  test("unit data for ks3 returns the correct programme slug", () => {
    const unitData = {
      planned_number_of_lessons: 5,
      connection_future_unit_description: null,
      connection_prior_unit_description: null,
      connection_future_unit_title: null,
      connection_prior_unit_title: null,
      domain: null,
      domain_id: null,
      examboard: null,
      examboard_slug: null,
      keystage_slug: "ks3",
      lessons: [],
      order: 1,
      phase: "Secondary",
      phase_slug: "secondary",
      slug: "cellular-respiration-and-atp",
      subject: "Combined Science",
      subject_parent: "Science",
      subject_parent_slug: "science",
      subject_slug: "combined-science",
      tags: null,
      subjectcategories: null,
      threads: [],
      tier: null,
      tier_slug: null,
      title: "Aerobic and anaerobic cellular respiration",
      unit_options: [],
      year: "9",
      cycle: "1",
      why_this_why_now: null,
      description: null,
      state: "published",
    };
    expect(createProgrammeSlug(unitData, "aqa")).toEqual(
      "combined-science-secondary-ks3",
    );
  });

  test("unit data for ks3 returns the correct programme slug", () => {
    const unitData = {
      planned_number_of_lessons: 5,
      connection_future_unit_description: null,
      connection_prior_unit_description: null,
      connection_future_unit_title: null,
      connection_prior_unit_title: null,
      domain: null,
      domain_id: null,
      examboard: null,
      examboard_slug: null,
      keystage_slug: "ks3",
      lessons: [],
      order: 1,
      phase: "Secondary",
      phase_slug: "secondary",
      slug: "cellular-respiration-and-atp",
      subject: "Combined Science",
      subject_parent: "Science",
      subject_parent_slug: "science",
      subject_slug: "combined-science",
      tags: null,
      subjectcategories: null,
      threads: [],
      tier: null,
      tier_slug: null,
      title: "Aerobic and anaerobic cellular respiration",
      unit_options: [],
      year: "9",
      cycle: "1",
      why_this_why_now: null,
      description: null,
      state: "published",
    };
    expect(createProgrammeSlug(unitData, "aqa")).toEqual(
      "combined-science-secondary-ks3",
    );
  });
});
