import { getMetaTitle } from "./getMetaTitle";

const mockKs4Options = [
  { slug: "aqa", title: "AQA" },
  { slug: "core", title: "Core" },
  { slug: "ocr", title: "OCR" },
];

const getMockCurriculumPhaseOptions = (withKsOptions: boolean) => [
  {
    slug: "maths",
    title: "Maths",
    phases: [
      { slug: "primary", title: "Primary" },
      { slug: "secondary", title: "Secondary" },
    ],
    keystages: [
      { slug: "ks1", title: "Key Stage 1" },
      { slug: "ks2", title: "Key Stage 2" },
      { slug: "ks3", title: "Key Stage 3" },
      { slug: "ks4", title: "Key Stage 4" },
    ],
    ks4_options: withKsOptions ? mockKs4Options : null,
  },
];

const getMockSubjectPhaseKeystageSlugs = (withKs4OptionSlug: boolean) => ({
  phaseSlug: "secondary",
  subjectSlug: "maths",
  ks4OptionSlug: withKs4OptionSlug ? "aqa" : null,
});

describe("getMetaTitle", () => {
  describe("By phase", () => {
    it("returns a default title with subject and phase", () => {
      const result = getMetaTitle(
        {
          subjects: getMockCurriculumPhaseOptions(false),
          subjectPhaseKeystageSlugs: getMockSubjectPhaseKeystageSlugs(false),
        },
        {},
      );
      expect(result.title).toEqual(
        "Free Secondary Maths Lesson & Curriculum Resources",
      );
    });
    it("returns a title with subject phase and thread", () => {
      const result = getMetaTitle(
        {
          subjects: getMockCurriculumPhaseOptions(false),
          subjectPhaseKeystageSlugs: getMockSubjectPhaseKeystageSlugs(false),
        },
        { threads: "thread-1" },
      );
      expect(result.title).toEqual(
        "Free Secondary Maths - thread 1 Lesson & Curriculum Resources",
      );
    });
    it("returns a title with subject phase and tier", () => {
      const result = getMetaTitle(
        {
          subjects: getMockCurriculumPhaseOptions(false),
          subjectPhaseKeystageSlugs: getMockSubjectPhaseKeystageSlugs(false),
        },
        { tiers: "foundation" },
      );
      expect(result.title).toEqual(
        "Free Secondary Maths Foundation Lesson & Curriculum Resources",
      );
    });
    it("returns a title with subject, phase and examboard", () => {
      const result = getMetaTitle(
        {
          subjects: getMockCurriculumPhaseOptions(true),
          subjectPhaseKeystageSlugs: getMockSubjectPhaseKeystageSlugs(true),
        },
        {},
      );
      expect(result.title).toEqual(
        "Free Secondary Maths AQA Lesson & Curriculum Resources",
      );
    });
    it("returns a title with subject, phase, examboard and tier", () => {
      const result = getMetaTitle(
        {
          subjects: getMockCurriculumPhaseOptions(true),
          subjectPhaseKeystageSlugs: getMockSubjectPhaseKeystageSlugs(true),
        },
        { tiers: "foundation" },
      );
      expect(result.title).toEqual(
        "Free Secondary Maths Foundation AQA Lesson & Curriculum Resources",
      );
    });
  });

  describe("By Keystage", () => {
    it("returns a title with keystage", () => {
      const result = getMetaTitle(
        {
          subjects: getMockCurriculumPhaseOptions(false),
          subjectPhaseKeystageSlugs: getMockSubjectPhaseKeystageSlugs(false),
        },
        { keystages: "ks3" },
      );
      expect(result.title).toEqual(
        "Free KS3 Maths Lesson & Curriculum Resources",
      );
    });
    it("returns a title with keystage and examboard", () => {
      const result = getMetaTitle(
        {
          subjects: getMockCurriculumPhaseOptions(true),
          subjectPhaseKeystageSlugs: getMockSubjectPhaseKeystageSlugs(true),
        },
        { keystages: "ks4" },
      );
      expect(result.title).toEqual(
        "Free KS4 Maths AQA Lesson & Curriculum Resources",
      );
    });
    it("returns a title with keystage and tier", () => {
      const result = getMetaTitle(
        {
          subjects: getMockCurriculumPhaseOptions(false),
          subjectPhaseKeystageSlugs: getMockSubjectPhaseKeystageSlugs(false),
        },
        { tiers: "foundation", keystages: "ks4" },
      );
      expect(result.title).toEqual(
        "Free KS4 Maths Foundation Lesson & Curriculum Resources",
      );
    });
    it("returns a title with keystage, examboard and tier", () => {
      const result = getMetaTitle(
        {
          subjects: getMockCurriculumPhaseOptions(true),
          subjectPhaseKeystageSlugs: getMockSubjectPhaseKeystageSlugs(true),
        },
        { tiers: "foundation", keystages: "ks4" },
      );
      expect(result.title).toEqual(
        "Free KS4 Maths Foundation AQA Lesson & Curriculum Resources",
      );
    });
  });

  describe("By year", () => {
    it("returns a title with year", () => {
      const result = getMetaTitle(
        {
          subjects: getMockCurriculumPhaseOptions(false),
          subjectPhaseKeystageSlugs: getMockSubjectPhaseKeystageSlugs(false),
        },
        { years: "7" },
      );
      expect(result.title).toEqual(
        "Free Y7 Maths Lesson & Curriculum Resources",
      );
    });
    it("returns a title with year and examboard", () => {
      const result = getMetaTitle(
        {
          subjects: getMockCurriculumPhaseOptions(true),
          subjectPhaseKeystageSlugs: getMockSubjectPhaseKeystageSlugs(true),
        },
        { years: "11" },
      );
      expect(result.title).toEqual(
        "Free Y11 Maths AQA Lesson & Curriculum Resources",
      );
    });
    it("returns a title with year and tier", () => {
      const result = getMetaTitle(
        {
          subjects: getMockCurriculumPhaseOptions(false),
          subjectPhaseKeystageSlugs: getMockSubjectPhaseKeystageSlugs(false),
        },
        { years: "7", tiers: "higher" },
      );
      expect(result.title).toEqual(
        "Free Y7 Maths Higher Lesson & Curriculum Resources",
      );
    });
    it("returns a title with year examboard and tier", () => {
      const result = getMetaTitle(
        {
          subjects: getMockCurriculumPhaseOptions(true),
          subjectPhaseKeystageSlugs: getMockSubjectPhaseKeystageSlugs(true),
        },
        { years: "7", tiers: "foundation" },
      );
      expect(result.title).toEqual(
        "Free Y7 Maths Foundation AQA Lesson & Curriculum Resources",
      );
    });
    it("returns a title with year and thread", () => {
      const result = getMetaTitle(
        {
          subjects: getMockCurriculumPhaseOptions(true),
          subjectPhaseKeystageSlugs: getMockSubjectPhaseKeystageSlugs(true),
        },
        { years: "7", tiers: "foundation", threads: "thread-1" },
      );
      expect(result.title).toEqual(
        "Free Y7 Maths Foundation AQA - thread 1 Lesson & Curriculum Resources",
      );
    });
  });
});
