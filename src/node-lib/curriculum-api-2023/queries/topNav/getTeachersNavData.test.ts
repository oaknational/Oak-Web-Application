import { programmeFieldsFixture } from "@oaknational/oak-curriculum-schema";

import { getProgrammeCount, getTeachersNavData } from "./getTeachersNavData";
import { mockResponseData } from "./fixtures";

import type { CurriculumPhaseOptions } from "@/node-lib/curriculum-api-2023/queries/curriculumPhaseOptions/curriculumPhaseOptions.query";

const curriculumPhaseOptionsSubjects: CurriculumPhaseOptions = [
  {
    title: "Art and design",
    slug: "art",
    phases: [
      { title: "Primary", slug: "primary" },
      { title: "Secondary", slug: "secondary" },
    ],
    ks4_options: [],
  },
  {
    title: "Financial education",
    slug: "financial-education",
    phases: [{ title: "Primary", slug: "primary" }],
    ks4_options: [],
  },
  {
    title: "Computing",
    slug: "computing",
    phases: [{ title: "Secondary", slug: "secondary" }],
    ks4_options: [
      { title: "AQA", slug: "aqa" },
      { title: "Edexcel", slug: "edexcel" },
    ],
  },
  {
    title: "Maths",
    slug: "maths",
    phases: [
      { title: "Primary", slug: "primary" },
      { title: "Secondary", slug: "secondary" },
    ],
    ks4_options: [],
  },
  {
    title: "Religious education",
    slug: "religious-education",
    phases: [{ title: "Secondary", slug: "secondary" }],
    ks4_options: [
      { title: "AQA", slug: "aqa" },
      { title: "Edexcel B", slug: "edexcelb" },
      { title: "Eduqas", slug: "eduqas" },
    ],
  },
];

const scienceChildProgrammes = [
  {
    programme_fields: programmeFieldsFixture({
      overrides: {
        keystage: "KS4",
        keystage_slug: "ks4",
        phase_slug: "secondary",
        subject: "Biology",
        subject_slug: "biology",
        subject_parent: "Science",
        examboard_slug: "aqa",
        examboard: "AQA",
      },
    }),
    features: {},
    actions: {},
    programme_slug: "biology-secondary-ks4-aqa",
  },
  {
    programme_fields: programmeFieldsFixture({
      overrides: {
        keystage: "KS4",
        keystage_slug: "ks4",
        phase_slug: "secondary",
        subject: "Physics",
        subject_slug: "physics",
        subject_parent: "Science",
        examboard_slug: "edexcel",
        examboard: "Edexcel",
      },
    }),
    features: {},
    actions: {},
    programme_slug: "physics-secondary-ks4-edexcel",
  },
  {
    programme_fields: programmeFieldsFixture({
      overrides: {
        keystage: "KS4",
        keystage_slug: "ks4",
        phase_slug: "secondary",
        subject: "Chemistry",
        subject_slug: "chemistry",
        subject_parent: "Science",
        examboard_slug: "ocr",
        examboard: "OCR",
      },
    }),
    features: {},
    actions: {},
    programme_slug: "chemistry-secondary-ks4-ocr",
  },
  {
    programme_fields: programmeFieldsFixture({
      overrides: {
        keystage: "KS4",
        keystage_slug: "ks4",
        phase_slug: "secondary",
        subject: "Combined science",
        subject_slug: "combined-science",
        subject_parent: "Science",
        examboard_slug: "ocr",
        examboard: "OCR",
      },
    }),
    features: {},
    actions: {},
    programme_slug: "combined-science-secondary-ks4-ocr",
  },
];

const getNav = (phase: "primary" | "secondary") =>
  getTeachersNavData(mockResponseData, phase, curriculumPhaseOptionsSubjects);

describe("getTeachersNavData", () => {
  it("gets primary data", () => {
    const result = getNav("primary");
    expect(result.phases.title).toBe("Primary");
    expect(result.keystages.children).toHaveLength(3);
  });
  it("gets secondary data", () => {
    const result = getNav("secondary");
    expect(result.phases.title).toBe("Secondary");
    expect(result.keystages.children).toHaveLength(2);
  });
  it("correctly identifies non curriculum subjects", () => {
    const result = getNav("primary");
    const financialEducation = result.keystages.children[0]?.children?.find(
      (s) => s.subjectSlug === "financial-education",
    );

    expect(financialEducation?.nonCurriculum).toBeTruthy();
  });
  it("includes EYFS in primary", () => {
    const result = getNav("primary");
    const eyfs = result.keystages.children.find(
      (ks) => ks.slug === "early-years-foundation-stage",
    );
    expect(eyfs).toBeDefined();
  });
  it("removes duplicate subjects from keystages", () => {
    const result = getNav("primary");
    const subjects = result.keystages.children[0]?.children;

    expect(subjects).toHaveLength(2);
  });
  it("includes pathways for ks4 subjects", () => {
    const result = getNav("secondary");
    const computing = result.keystages.children[1]?.children?.filter(
      (s) => s.subjectSlug === "computing",
    );
    expect(computing).toHaveLength(2);
  });
  it("returns a valid programme slug for subjects with one programme per keystage", () => {
    const result = getNav("secondary");
    const multipleProgrammeSubject =
      result.keystages.children[1]?.children?.find(
        (s) => s.programmeCount === 1,
      );
    expect(multipleProgrammeSubject?.programmeSlug).not.toBeNull();
  });
  it("returns programme slug as null for subjects with multiple programmes at keystage", () => {
    const result = getNav("secondary");
    const multipleProgrammeSubject =
      result.keystages.children[1]?.children?.find((s) => s.programmeCount > 1);
    expect(multipleProgrammeSubject?.programmeSlug).toBeNull();
  });
  it("uses subect name overrides", () => {
    const result = getNav("secondary");
    const gcseComputing = result.keystages.children[1]?.children?.find(
      (s) => s.subjectSlug === "computing" && s.programmeCount > 1,
    );

    expect(gcseComputing?.title).toEqual("Computer science (GCSE)");
  });
  it("handles subjects with only one pathway and examboards (RE)", () => {
    const result = getNav("secondary");
    const gcseRe = result.keystages.children[1]?.children?.filter(
      (s) => s.subjectSlug === "religious-education",
    );

    expect(gcseRe).toHaveLength(1); // No core option
    expect(gcseRe?.[0]?.title).toBe("Religious education (GCSE)"); // gcse in title
    expect(gcseRe?.[0]?.programmeCount).toBe(3); // one programme per examboard
  });

  it("builds exam board hrefs from programme slugs", () => {
    const result = getNav("secondary");
    const gcseComputing = result.keystages.children[1]?.children?.find(
      (s) =>
        s.subjectSlug === "computing" && s.title === "Computer science (GCSE)",
    );

    expect(gcseComputing?.children).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: "Edexcel",
          href: "/teachers/programmes/computing-secondary-edexcel/units?keystages=ks4",
        }),
        expect.objectContaining({
          title: "AQA",
          href: "/teachers/programmes/computing-secondary-aqa/units?keystages=ks4",
        }),
      ]),
    );
  });

  it("builds tier hrefs from programme slugs", () => {
    const result = getNav("secondary");
    const maths = result.keystages.children[1]?.children?.find(
      (s) => s.subjectSlug === "maths",
    );

    expect(maths?.children).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          title: "Higher",
          href: "/teachers/programmes/maths-secondary/units?keystages=ks4&tiers=higher",
        }),
        expect.objectContaining({
          title: "Foundation",
          href: "/teachers/programmes/maths-secondary/units?keystages=ks4&tiers=foundation",
        }),
      ]),
    );
  });

  it("groups parent subject with multiple KS4 children in phase view", () => {
    const result = getTeachersNavData(
      {
        ...mockResponseData,
        programmes: [...mockResponseData.programmes, ...scienceChildProgrammes],
      },
      "secondary",
      curriculumPhaseOptionsSubjects,
    );

    const science = result.phases.children.find(
      (subject) => subject.slug === "science",
    );

    expect(science).toBeDefined();
    expect(science?.title).toBe("Science");
    expect(science?.programmeSlug).toBeNull();
    expect(science?.children).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: "AQA" }),
        expect.objectContaining({ title: "Edexcel" }),
        expect.objectContaining({ title: "OCR" }),
      ]),
    );
    expect(science?.children).toHaveLength(3);
  });
});

describe("getProgrammeCount", () => {
  it("gets the correct programme count for primary subjects", () => {
    const result = getProgrammeCount({
      data: mockResponseData,
      keystageSlug: "ks1",
      subjectSlug: "art",
      pathwaySlug: null,
    });
    expect(result).toBe(1);
  });
  it("gets the correct programme count for secondary subjects with tiers", () => {
    const result = getProgrammeCount({
      data: mockResponseData,
      keystageSlug: "ks4",
      subjectSlug: "maths",
      pathwaySlug: null,
    });
    expect(result).toBe(2);
  });
  it("gets the correct programme count for secondary subjects with pathways with no pfs", () => {
    const result = getProgrammeCount({
      data: mockResponseData,
      keystageSlug: "ks4",
      subjectSlug: "computing",
      pathwaySlug: "core",
    });
    expect(result).toBe(1);
  });
  it("gets the correct programme count for secondary subjects with pathways with pfs", () => {
    const result = getProgrammeCount({
      data: mockResponseData,
      keystageSlug: "ks4",
      subjectSlug: "computing",
      pathwaySlug: "gcse",
    });
    expect(result).toBe(2);
  });
});
