import {
  createTeacherProgrammeSlug,
  getKs4RedirectSlug,
  getTeacherSubjectPhaseSlug,
  isValidSubjectPhaseSlug,
  KS4_EXAMBOARD_PREFERENCE,
  parseSubjectPhaseSlug,
} from "./slugs";

import { createUnit } from "@/fixtures/curriculum/unit";
import { CurriculumPhaseOptions } from "@/node-lib/curriculum-api-2023/queries/curriculumPhaseOptions/curriculumPhaseOptions.query";

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

const testCurriculumPhaseOptions: CurriculumPhaseOptions = [
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
      isValidSubjectPhaseSlug(testCurriculumPhaseOptions, {
        phaseSlug: "primary",
        subjectSlug: "english",
        ks4OptionSlug: null,
      }),
    ).toEqual(true);

    expect(
      isValidSubjectPhaseSlug(testCurriculumPhaseOptions, {
        phaseSlug: "secondary",
        subjectSlug: "english",
        ks4OptionSlug: "aqa",
      }),
    ).toEqual(true);
  });

  it("invalid to return false", () => {
    expect(
      isValidSubjectPhaseSlug(testCurriculumPhaseOptions, {
        phaseSlug: "foo",
        subjectSlug: "english",
        ks4OptionSlug: null,
      }),
    ).toEqual(false);

    expect(
      isValidSubjectPhaseSlug(testCurriculumPhaseOptions, {
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
      getKs4RedirectSlug(testCurriculumPhaseOptions, {
        subjectSlug: "english",
        phaseSlug: "secondary",
        ks4OptionSlug: "aqa",
      }),
    ).toEqual(undefined);
  });

  it("return undefined if no match", () => {
    expect(
      getKs4RedirectSlug(testCurriculumPhaseOptions, {
        subjectSlug: "test",
        phaseSlug: "secondary",
        ks4OptionSlug: null,
      }),
    ).toEqual(undefined);
  });

  it("return correct default when specified", () => {
    expect(
      getKs4RedirectSlug(testCurriculumPhaseOptions, {
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

describe("createTeacherProgrammeSlug", () => {
  test("unit data ks2 returns correct programme slug", () => {
    const unitData = createUnit({
      keystage_slug: "ks2",
      phase: "Primary",
      phase_slug: "primary",
      subject: "Science",
      subject_slug: "science",
      subject_parent: null,
      subject_parent_slug: null,
    });
    expect(createTeacherProgrammeSlug(unitData)).toEqual("science-primary-ks2");
  });
  test("unit data ks4 returns correct programme slug", () => {
    const unitData = createUnit({
      phase: "Primary",
      phase_slug: "primary",
      subject: "Science",
      subject_slug: "science",
      subject_parent: null,
      subject_parent_slug: null,
    });
    expect(createTeacherProgrammeSlug(unitData)).toEqual("science-primary-ks2");
  });
  test("unit data with exam board and tier returns the correct programme slug", () => {
    const unitData = createUnit({
      examboard: "aqa",
      tier: "foundation",
      year: "10",
    });
    expect(createTeacherProgrammeSlug(unitData, "aqa", "foundation")).toEqual(
      "transfiguration-secondary-ks4-foundation-aqa",
    );
  });
  test("unit data for ks3 returns the correct programme slug", () => {
    const unitData = createUnit({ keystage_slug: "ks3", year: "9" });
    expect(createTeacherProgrammeSlug(unitData, "aqa")).toEqual(
      "transfiguration-secondary-ks3",
    );
  });

  test("unit data for ks3 returns the correct programme slug", () => {
    const unitData = createUnit({ keystage_slug: "ks3", year: "9" });
    expect(createTeacherProgrammeSlug(unitData, "aqa")).toEqual(
      "transfiguration-secondary-ks3",
    );
  });

  test("core pathway excludes examboard from slug (Computing)", () => {
    const unitData = createUnit({
      slug: "online-safety",
      subject: "Computing",
      subject_parent: null,
      subject_parent_slug: null,
      subject_slug: "computing",
      title: "Online safety",
      year: "10",
    });
    expect(
      createTeacherProgrammeSlug(unitData, "ocr", undefined, "core"),
    ).toEqual("computing-secondary-ks4-core");
  });

  test("core pathway excludes examboard from slug (PE)", () => {
    const unitData = createUnit({
      slug: "health-fitness-and-wellbeing",
      subject: "Physical Education",
      subject_parent: null,
      subject_parent_slug: null,
      subject_slug: "physical-education",
      title: "Health, fitness and wellbeing",
      year: "10",
    });
    expect(
      createTeacherProgrammeSlug(unitData, "ocr", undefined, "core"),
    ).toEqual("physical-education-secondary-ks4-core");
  });
});
test("gcse pathway excludes examboard when examboard equals pathway", () => {
  const unitData = createUnit({
    slug: "what-can-we-do-to-reduce-crime",
    subject: "Citizenship",
    subject_parent: null,
    subject_parent_slug: null,
    subject_slug: "citizenship",
    title: "What can we do to reduce crime?",
    year: "10",
  });
  expect(
    createTeacherProgrammeSlug(unitData, "gcse", undefined, "gcse"),
  ).toEqual("citizenship-secondary-ks4-gcse");
});
test("core pathway with no examboard returns correct programme slug", () => {
  expect(
    getTeacherSubjectPhaseSlug({
      subjectSlug: "computing",
      phaseSlug: "secondary",
      pathwaySlug: "core",
    }),
  ).toEqual("computing-secondary-core");
});
test("gcse pathway with examboard and pathway returns correct programme slug", () => {
  expect(
    getTeacherSubjectPhaseSlug({
      subjectSlug: "computing",
      phaseSlug: "secondary",
      examboardSlug: "ocr",
      pathwaySlug: "gcse",
    }),
  ).toEqual("computing-secondary-ocr");
});
