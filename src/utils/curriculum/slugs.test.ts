import {
  createTeacherProgrammeSlug,
  getKs4RedirectSlug,
  getPreferredKs4OptionSlug,
  getTeacherSubjectPhaseSlug,
  isValidSubjectPhaseSlug,
  KS4_EXAMBOARD_PREFERENCE,
  parseProgrammeSlug,
  parseSubjectPhaseSlug,
  resolveTeacherProgrammeSubjectPhaseSlug,
} from "./slugs";

import { createUnit } from "@/fixtures/curriculum/unit";
import { CurriculumPhaseOptions } from "@/node-lib/curriculum-api-2023/queries/curriculumPhaseOptions/curriculumPhaseOptions.query";

describe("parseProgrammeSlug", () => {
  it("parses ks3 programme slug", () => {
    expect(parseProgrammeSlug("citizenship-secondary-ks3")).toEqual({
      subjectSlug: "citizenship",
      phaseSlug: "secondary",
      keystageSlug: "ks3",
      yearSlug: null,
      tierSlug: null,
      pathwaySlug: null,
      examboardSlug: null,
    });
  });

  it("parses ks4 slug with pathway and examboard", () => {
    expect(parseProgrammeSlug("computing-secondary-ks4-gcse-aqa")).toEqual({
      subjectSlug: "computing",
      phaseSlug: "secondary",
      keystageSlug: "ks4",
      yearSlug: null,
      tierSlug: null,
      pathwaySlug: "gcse",
      examboardSlug: "aqa",
    });
  });

  it("parses ks4 slug with tier only", () => {
    expect(parseProgrammeSlug("maths-secondary-ks4-foundation")).toEqual({
      subjectSlug: "maths",
      phaseSlug: "secondary",
      keystageSlug: "ks4",
      yearSlug: null,
      tierSlug: "foundation",
      pathwaySlug: null,
      examboardSlug: null,
    });
  });

  it("parses primary ks1 slug", () => {
    expect(parseProgrammeSlug("computing-primary-ks1")).toEqual({
      subjectSlug: "computing",
      phaseSlug: "primary",
      keystageSlug: "ks1",
      yearSlug: null,
      tierSlug: null,
      pathwaySlug: null,
      examboardSlug: null,
    });
  });

  it("parses legacy science programme slug with biology as subject", () => {
    expect(
      parseProgrammeSlug("biology-secondary-ks4-higher-aqa"),
    ).toMatchObject({
      subjectSlug: "biology",
      tierSlug: "higher",
      examboardSlug: "aqa",
    });
  });

  it("parses pathway-only ks4 slug", () => {
    expect(parseProgrammeSlug("citizenship-secondary-ks4-gcse")).toEqual({
      subjectSlug: "citizenship",
      phaseSlug: "secondary",
      keystageSlug: "ks4",
      yearSlug: null,
      tierSlug: null,
      pathwaySlug: "gcse",
      examboardSlug: null,
    });
  });

  it("parses core pathway slug", () => {
    expect(parseProgrammeSlug("computing-secondary-ks4-core")).toEqual({
      subjectSlug: "computing",
      phaseSlug: "secondary",
      keystageSlug: "ks4",
      yearSlug: null,
      tierSlug: null,
      pathwaySlug: "core",
      examboardSlug: null,
    });
  });

  it("strips legacy suffix before parsing", () => {
    expect(parseProgrammeSlug("chemistry-secondary-ks4-l")).toMatchObject({
      subjectSlug: "chemistry",
      keystageSlug: "ks4",
    });
  });

  it("returns null for invalid slug", () => {
    expect(parseProgrammeSlug("not-a-valid-slug")).toBeNull();
  });
});

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

describe("getPreferredKs4OptionSlug", () => {
  it("returns the preferred exam board when listed", () => {
    expect(
      getPreferredKs4OptionSlug("english", ["edexcel", "aqa", "ocr"]),
    ).toBe("aqa");
  });

  it("returns the first ks4 option when preference is not in the list", () => {
    expect(getPreferredKs4OptionSlug("citizenship", ["gcse", "core"])).toBe(
      "gcse",
    );
  });

  it("returns the first option when no preference exists", () => {
    expect(getPreferredKs4OptionSlug("maths", ["edexcel", "aqa"])).toBe(
      "edexcel",
    );
  });

  it("returns null when no options are provided", () => {
    expect(getPreferredKs4OptionSlug("english", [])).toBeNull();
  });
});

describe("resolveTeacherProgrammeSubjectPhaseSlug", () => {
  const citizenshipOptions: CurriculumPhaseOptions = [
    {
      title: "Citizenship",
      slug: "citizenship",
      phases: [{ title: "Secondary", slug: "secondary" }],
      ks4_options: [
        { title: "GCSE", slug: "gcse" },
        { title: "Core", slug: "core" },
      ],
      keystages: [{ title: "KS4", slug: "ks4" }],
    },
  ];

  const designTechnologyOptions: CurriculumPhaseOptions = [
    {
      title: "Design and technology",
      slug: "design-technology",
      phases: [{ title: "Secondary", slug: "secondary" }],
      ks4_options: null,
      keystages: [{ title: "KS3", slug: "ks3" }],
    },
  ];

  it("redirects citizenship to gcse", () => {
    expect(
      resolveTeacherProgrammeSubjectPhaseSlug(citizenshipOptions, {
        subjectSlug: "citizenship",
        phaseSlug: "secondary",
      }),
    ).toBe("citizenship-secondary-gcse");
  });

  it("uses pathway slug without ks4 redirect", () => {
    expect(
      resolveTeacherProgrammeSubjectPhaseSlug(citizenshipOptions, {
        subjectSlug: "citizenship",
        phaseSlug: "secondary",
        pathwaySlug: "core",
      }),
    ).toBe("citizenship-secondary-core");
  });

  it("does not append ks4 option when subject has no ks4_options", () => {
    expect(
      resolveTeacherProgrammeSubjectPhaseSlug(designTechnologyOptions, {
        subjectSlug: "design-technology",
        phaseSlug: "secondary",
      }),
    ).toBe("design-technology-secondary");
  });

  it("appends preferred exam board for english", () => {
    expect(
      resolveTeacherProgrammeSubjectPhaseSlug(testCurriculumPhaseOptions, {
        subjectSlug: "english",
        phaseSlug: "secondary",
      }),
    ).toBe(`english-secondary-${KS4_EXAMBOARD_PREFERENCE["english"]}`);
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

  it("redirects citizenship to gcse not the unused aqa preference", () => {
    const citizenshipOptions: CurriculumPhaseOptions = [
      {
        title: "Citizenship",
        slug: "citizenship",
        phases: [{ title: "Secondary", slug: "secondary" }],
        ks4_options: [
          { title: "GCSE", slug: "gcse" },
          { title: "Core", slug: "core" },
        ],
        keystages: [{ title: "KS4", slug: "ks4" }],
      },
    ];

    expect(
      getKs4RedirectSlug(citizenshipOptions, {
        subjectSlug: "citizenship",
        phaseSlug: "secondary",
        ks4OptionSlug: null,
      }),
    ).toEqual({
      subjectSlug: "citizenship",
      phaseSlug: "secondary",
      ks4OptionSlug: "gcse",
    });
  });

  it("does not redirect when the subject has no ks4_options", () => {
    const designTechnologyOptions: CurriculumPhaseOptions = [
      {
        title: "Design and technology",
        slug: "design-technology",
        phases: [{ title: "Secondary", slug: "secondary" }],
        ks4_options: null,
        keystages: [{ title: "KS3", slug: "ks3" }],
      },
    ];

    expect(
      getKs4RedirectSlug(designTechnologyOptions, {
        subjectSlug: "design-technology",
        phaseSlug: "secondary",
        ks4OptionSlug: null,
      }),
    ).toBeUndefined();
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
