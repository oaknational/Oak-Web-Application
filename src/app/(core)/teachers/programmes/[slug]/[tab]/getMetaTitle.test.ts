import { getMetaTitle } from "./getMetaTitle";

import { createUnit } from "@/fixtures/curriculum/unit";

const mockProgrammeUnitsData = {
  curriculaDesc: "curriculum",
  subjectTitle: "Maths",
  phaseTitle: "Secondary",
  nonCurriculum: false,
};
const mockKs4Options = [
  { slug: "aqa", title: "AQA" },
  { slug: "core", title: "Core" },
  { slug: "ocr", title: "OCR" },
];

const getMockCurriculumPhaseOptions = (withKsOptions: boolean) => ({
  tab: "units" as const,
  subjects: [
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
  ],
});

const mockCurriculumUnitsData = {
  units: [
    createUnit({
      slug: "unit-1",
      title: "Unit 1",
      order: 1,
      examboard: null,
      examboard_slug: null,
      year: "5",
      subject_slug: "maths",
      phase_slug: "secondary",
      threads: [{ slug: "thread-1", title: "Thread 1", order: 1 }],
    }),
  ],
};

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
          programmeUnitsData: mockProgrammeUnitsData,
          curriculumPhaseOptions: getMockCurriculumPhaseOptions(false),
          curriculumUnitsData: mockCurriculumUnitsData,
          subjectPhaseKeystageSlugs: getMockSubjectPhaseKeystageSlugs(false),
        },
        {},
      );
      expect(result).toEqual(
        "Free Secondary Maths Lesson & Curriculum Resources",
      );
    });
    it("returns a title with subject phase and thread", () => {
      const result = getMetaTitle(
        {
          programmeUnitsData: mockProgrammeUnitsData,
          curriculumPhaseOptions: getMockCurriculumPhaseOptions(false),
          curriculumUnitsData: mockCurriculumUnitsData,
          subjectPhaseKeystageSlugs: getMockSubjectPhaseKeystageSlugs(false),
        },
        { threads: "thread-1" },
      );
      expect(result).toEqual(
        "Free Secondary Maths - Thread 1 Lesson & Curriculum Resources",
      );
    });
    it("returns a title with subject phase and tier", () => {
      const result = getMetaTitle(
        {
          programmeUnitsData: mockProgrammeUnitsData,
          curriculumPhaseOptions: getMockCurriculumPhaseOptions(false),
          curriculumUnitsData: mockCurriculumUnitsData,
          subjectPhaseKeystageSlugs: getMockSubjectPhaseKeystageSlugs(false),
        },
        { tiers: "foundation" },
      );
      expect(result).toEqual(
        "Free Secondary Maths Foundation Lesson & Curriculum Resources",
      );
    });
    it("returns a title with subject, phase and examboard", () => {
      const result = getMetaTitle(
        {
          programmeUnitsData: mockProgrammeUnitsData,
          curriculumPhaseOptions: getMockCurriculumPhaseOptions(true),
          curriculumUnitsData: mockCurriculumUnitsData,
          subjectPhaseKeystageSlugs: getMockSubjectPhaseKeystageSlugs(true),
        },
        {},
      );
      expect(result).toEqual(
        "Free Secondary Maths AQA Lesson & Curriculum Resources",
      );
    });
    it("returns a title with subject, phase, examboard and tier", () => {
      const result = getMetaTitle(
        {
          programmeUnitsData: mockProgrammeUnitsData,
          curriculumPhaseOptions: getMockCurriculumPhaseOptions(true),
          curriculumUnitsData: mockCurriculumUnitsData,
          subjectPhaseKeystageSlugs: getMockSubjectPhaseKeystageSlugs(true),
        },
        { tiers: "foundation" },
      );
      expect(result).toEqual(
        "Free Secondary Maths Foundation AQA Lesson & Curriculum Resources",
      );
    });
  });

  describe("By Keystage", () => {
    it("returns a title with keystage", () => {
      const result = getMetaTitle(
        {
          programmeUnitsData: mockProgrammeUnitsData,
          curriculumPhaseOptions: getMockCurriculumPhaseOptions(false),
          curriculumUnitsData: mockCurriculumUnitsData,
          subjectPhaseKeystageSlugs: getMockSubjectPhaseKeystageSlugs(false),
        },
        { keystages: "ks3" },
      );
      expect(result).toEqual("Free KS3 Maths Lesson & Curriculum Resources");
    });
    it("returns a title with keystage and examboard", () => {
      const result = getMetaTitle(
        {
          programmeUnitsData: mockProgrammeUnitsData,
          curriculumPhaseOptions: getMockCurriculumPhaseOptions(true),
          curriculumUnitsData: mockCurriculumUnitsData,
          subjectPhaseKeystageSlugs: getMockSubjectPhaseKeystageSlugs(true),
        },
        { keystages: "ks4" },
      );
      expect(result).toEqual(
        "Free KS4 Maths AQA Lesson & Curriculum Resources",
      );
    });
    it("returns a title with keystage and tier", () => {
      const result = getMetaTitle(
        {
          programmeUnitsData: mockProgrammeUnitsData,
          curriculumPhaseOptions: getMockCurriculumPhaseOptions(false),
          curriculumUnitsData: mockCurriculumUnitsData,
          subjectPhaseKeystageSlugs: getMockSubjectPhaseKeystageSlugs(false),
        },
        { tiers: "foundation", keystages: "ks4" },
      );
      expect(result).toEqual(
        "Free KS4 Maths Foundation Lesson & Curriculum Resources",
      );
    });
    it("returns a title with keystage, examboard and tier", () => {
      const result = getMetaTitle(
        {
          programmeUnitsData: mockProgrammeUnitsData,
          curriculumPhaseOptions: getMockCurriculumPhaseOptions(true),
          curriculumUnitsData: mockCurriculumUnitsData,
          subjectPhaseKeystageSlugs: getMockSubjectPhaseKeystageSlugs(true),
        },
        { tiers: "foundation", keystages: "ks4" },
      );
      expect(result).toEqual(
        "Free KS4 Maths Foundation AQA Lesson & Curriculum Resources",
      );
    });
  });

  describe("By year", () => {
    it("returns a title with year", () => {
      const result = getMetaTitle(
        {
          programmeUnitsData: mockProgrammeUnitsData,
          curriculumPhaseOptions: getMockCurriculumPhaseOptions(false),
          curriculumUnitsData: mockCurriculumUnitsData,
          subjectPhaseKeystageSlugs: getMockSubjectPhaseKeystageSlugs(false),
        },
        { years: "7" },
      );
      expect(result).toEqual("Free Y7 Maths Lesson & Curriculum Resources");
    });
    it("returns a title with year and examboard", () => {
      const result = getMetaTitle(
        {
          programmeUnitsData: mockProgrammeUnitsData,
          curriculumPhaseOptions: getMockCurriculumPhaseOptions(true),
          curriculumUnitsData: mockCurriculumUnitsData,
          subjectPhaseKeystageSlugs: getMockSubjectPhaseKeystageSlugs(true),
        },
        { years: "11" },
      );
      expect(result).toEqual(
        "Free Y11 Maths AQA Lesson & Curriculum Resources",
      );
    });
    it("returns a title with year and tier", () => {
      const result = getMetaTitle(
        {
          programmeUnitsData: mockProgrammeUnitsData,
          curriculumPhaseOptions: getMockCurriculumPhaseOptions(false),
          curriculumUnitsData: mockCurriculumUnitsData,
          subjectPhaseKeystageSlugs: getMockSubjectPhaseKeystageSlugs(false),
        },
        { years: "7", tiers: "higher" },
      );
      expect(result).toEqual(
        "Free Y7 Maths Higher Lesson & Curriculum Resources",
      );
    });
    it("returns a title with year examboard and tier", () => {
      const result = getMetaTitle(
        {
          programmeUnitsData: mockProgrammeUnitsData,
          curriculumPhaseOptions: getMockCurriculumPhaseOptions(true),
          curriculumUnitsData: mockCurriculumUnitsData,
          subjectPhaseKeystageSlugs: getMockSubjectPhaseKeystageSlugs(true),
        },
        { years: "7", tiers: "foundation" },
      );
      expect(result).toEqual(
        "Free Y7 Maths Foundation AQA Lesson & Curriculum Resources",
      );
    });
    it("returns a title with year and thread", () => {
      const result = getMetaTitle(
        {
          programmeUnitsData: mockProgrammeUnitsData,
          curriculumPhaseOptions: getMockCurriculumPhaseOptions(true),
          curriculumUnitsData: mockCurriculumUnitsData,
          subjectPhaseKeystageSlugs: getMockSubjectPhaseKeystageSlugs(true),
        },
        { years: "7", tiers: "foundation", threads: "thread-1" },
      );
      expect(result).toEqual(
        "Free Y7 Maths Foundation AQA - Thread 1 Lesson & Curriculum Resources",
      );
    });
  });
});
