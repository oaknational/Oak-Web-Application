import { getSubheadingIconName } from "./getSubheadingIconName";

import { CurriculumFilters, YearData, Unit } from "@/utils/curriculum/types";

/** Subject slugs that map to valid Oak icon names (e.g. subject-english, subject-maths). */
const VALID_SUBJECT_SLUGS = ["english", "maths", "science"] as const;

/** Subject slug that does not map to a valid Oak icon name. */
const INVALID_SUBJECT_SLUG = "tofu-carving";

const defaultFilters: CurriculumFilters = {
  years: [],
  tiers: [],
  childSubjects: [],
  pathways: [],
  subjectCategories: [],
  threads: [],
};

const yearDataWithSubjectCategory = (slug: string): YearData[string] => ({
  units: [],
  childSubjects: [],
  pathways: [],
  tiers: [],
  subjectCategories: [{ id: 1, title: "Category", slug }],
  isSwimming: false,
  groupAs: null,
  nationalCurriculum: [],
});

const yearDataWithChildSubject = (subject_slug: string): YearData[string] => ({
  units: [],
  childSubjects: [{ subject: "Subject", subject_slug }],
  pathways: [],
  tiers: [],
  subjectCategories: [],
  isSwimming: false,
  groupAs: null,
  nationalCurriculum: [],
});

const unitWithSubject = (subject_slug: string): Unit =>
  ({
    subject_slug,
    subject: "Subject",
    slug: "unit-slug",
    title: "Unit",
    year: "7",
    order: 1,
  }) as Unit;

describe("getSubheadingIconName", () => {
  describe("subject categories path (KS1-KS3)", () => {
    it("returns subject category icon when single category selected and present in year data (KS3 year)", () => {
      const result = getSubheadingIconName(
        "7",
        [unitWithSubject(VALID_SUBJECT_SLUGS[0])],
        yearDataWithSubjectCategory(VALID_SUBJECT_SLUGS[0]),
        {
          ...defaultFilters,
          subjectCategories: [VALID_SUBJECT_SLUGS[0]],
        },
      );
      expect(result).toBe("subject-english");
    });

    it("returns subject category icon when single category selected (KS1 year)", () => {
      const result = getSubheadingIconName(
        "1",
        [unitWithSubject(VALID_SUBJECT_SLUGS[1])],
        yearDataWithSubjectCategory(VALID_SUBJECT_SLUGS[1]),
        {
          ...defaultFilters,
          subjectCategories: [VALID_SUBJECT_SLUGS[1]],
        },
      );
      expect(result).toBe("subject-maths");
    });

    it("skips subject categories when 'all' is selected and falls through to unit fallback", () => {
      const result = getSubheadingIconName(
        "7",
        [unitWithSubject(VALID_SUBJECT_SLUGS[0])],
        yearDataWithSubjectCategory(VALID_SUBJECT_SLUGS[0]),
        {
          ...defaultFilters,
          subjectCategories: ["all"],
        },
      );
      expect(result).toBe("subject-english");
    });

    it("skips subject categories when filter slug not in year data and falls through to unit fallback", () => {
      const result = getSubheadingIconName(
        "7",
        [unitWithSubject(VALID_SUBJECT_SLUGS[2])],
        yearDataWithSubjectCategory(VALID_SUBJECT_SLUGS[0]),
        {
          ...defaultFilters,
          subjectCategories: ["unknown"],
        },
      );
      expect(result).toBe("subject-science");
    });

    it("skips subject categories when multiple categories selected and falls through to unit fallback", () => {
      const yearData: YearData[string] = {
        ...yearDataWithSubjectCategory(VALID_SUBJECT_SLUGS[0]),
        subjectCategories: [
          { id: 1, title: "English", slug: VALID_SUBJECT_SLUGS[0] },
          { id: 2, title: "Maths", slug: VALID_SUBJECT_SLUGS[1] },
        ],
      };
      const result = getSubheadingIconName(
        "7",
        [unitWithSubject(VALID_SUBJECT_SLUGS[0])],
        yearData,
        {
          ...defaultFilters,
          subjectCategories: [VALID_SUBJECT_SLUGS[0], VALID_SUBJECT_SLUGS[1]],
        },
      );
      expect(result).toBe("subject-english");
    });

    it("does not use subject categories for KS4 year when child subjects are selected", () => {
      const result = getSubheadingIconName(
        "10",
        [unitWithSubject(VALID_SUBJECT_SLUGS[1])],
        yearDataWithChildSubject(VALID_SUBJECT_SLUGS[1]),
        {
          ...defaultFilters,
          subjectCategories: [VALID_SUBJECT_SLUGS[0]],
          childSubjects: [VALID_SUBJECT_SLUGS[1]],
        },
      );
      expect(result).toBe("subject-maths");
    });
  });

  describe("child subjects path (KS4)", () => {
    it("returns child subject icon when single child subject selected and present in year data", () => {
      const result = getSubheadingIconName(
        "10",
        [unitWithSubject(VALID_SUBJECT_SLUGS[0])],
        yearDataWithChildSubject(VALID_SUBJECT_SLUGS[1]),
        {
          ...defaultFilters,
          childSubjects: [VALID_SUBJECT_SLUGS[1]],
        },
      );
      expect(result).toBe("subject-maths");
    });

    it("skips child subjects when multiple selected and falls through to unit fallback", () => {
      const yearData: YearData[string] = {
        ...yearDataWithChildSubject(VALID_SUBJECT_SLUGS[1]),
        childSubjects: [
          { subject: "Maths", subject_slug: VALID_SUBJECT_SLUGS[1] },
          { subject: "English", subject_slug: VALID_SUBJECT_SLUGS[0] },
        ],
      };
      const result = getSubheadingIconName(
        "10",
        [unitWithSubject(VALID_SUBJECT_SLUGS[2])],
        yearData,
        {
          ...defaultFilters,
          childSubjects: [VALID_SUBJECT_SLUGS[1], VALID_SUBJECT_SLUGS[0]],
        },
      );
      expect(result).toBe("subject-science");
    });

    it("skips child subjects when filter slug not in year data and falls through to unit fallback", () => {
      const result = getSubheadingIconName(
        "10",
        [unitWithSubject(VALID_SUBJECT_SLUGS[2])],
        yearDataWithChildSubject(VALID_SUBJECT_SLUGS[1]),
        {
          ...defaultFilters,
          childSubjects: ["unknown"],
        },
      );
      expect(result).toBe("subject-science");
    });
  });

  describe("fallback to first unit subject_slug", () => {
    it("returns icon from first unit when no subject category or child subject path applies", () => {
      const result = getSubheadingIconName(
        "7",
        [unitWithSubject(VALID_SUBJECT_SLUGS[2])],
        yearDataWithSubjectCategory(VALID_SUBJECT_SLUGS[0]),
        defaultFilters,
      );
      expect(result).toBe("subject-science");
    });

    it("returns null when no units", () => {
      const result = getSubheadingIconName("7", [], undefined, defaultFilters);
      expect(result).toBe(null);
    });

    it("returns `books` when subject does not have an icon", () => {
      const result = getSubheadingIconName(
        "7",
        [unitWithSubject(INVALID_SUBJECT_SLUG)],
        undefined,
        defaultFilters,
      );
      expect(result).toBe("books");
    });
  });

  describe("edge cases", () => {
    it("returns null when yearData is undefined and no units", () => {
      const result = getSubheadingIconName("7", [], undefined, defaultFilters);
      expect(result).toBe(null);
    });

    it("returns null when single subject category slug is not a valid icon name and no unit fallback", () => {
      const result = getSubheadingIconName(
        "7",
        [],
        yearDataWithSubjectCategory(INVALID_SUBJECT_SLUG),
        {
          ...defaultFilters,
          subjectCategories: [INVALID_SUBJECT_SLUG],
        },
      );
      expect(result).toBe(null);
    });

    it("returns null when single child subject slug is not a valid icon name", () => {
      const result = getSubheadingIconName(
        "10",
        [],
        yearDataWithChildSubject(INVALID_SUBJECT_SLUG),
        {
          ...defaultFilters,
          childSubjects: [INVALID_SUBJECT_SLUG],
        },
      );
      expect(result).toBe(null);
    });
  });
});
