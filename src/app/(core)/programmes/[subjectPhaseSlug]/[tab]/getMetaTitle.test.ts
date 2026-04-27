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
        "Free Secondary Maths Lesson & Curriculum Resources | Oak National Academy",
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
        "Free Secondary Maths - Thread 1 Lesson & Curriculum Resources | Oak National Academy",
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
        "Free Secondary Maths Foundation Lesson & Curriculum Resources | Oak National Academy",
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
        "Free Secondary Maths AQA Lesson & Curriculum Resources | Oak National Academy",
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
        "Free Secondary Maths Foundation AQA Lesson & Curriculum Resources | Oak National Academy",
      );
    });
  });

  describe("By Keystage", () => {
    it.todo("returns a title with keystage");
    it.todo("returns a title with keystage and examboard");
    it.todo("returns a title with keystage, phase and tier");
    it.todo("returns a title with keystage, phase, examboard and tier");
  });

  describe("By year", () => {
    it.todo("returns a title with year");
    it.todo("returns a title with year and examboard");
    it.todo("returns a title with year, phase and tier");
    it.todo("returns a title with year, phase, examboard and tier");
    it.todo("returns a title with year and thread");
  });
});
