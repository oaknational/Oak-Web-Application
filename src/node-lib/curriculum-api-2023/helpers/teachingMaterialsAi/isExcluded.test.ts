import type {
  LessonBrowseDataByKs,
  LessonOverviewContent,
} from "../../queries/lessonOverview/lessonOverview.schema";

import { isExcludedFromTeachingMaterials } from "./isExcluded";

interface WorksListItem {
  [key: string]: unknown;
}

describe("isExcludedFromTeachingMaterials", () => {
  const mockBrowseData: LessonBrowseDataByKs["lessonData"] = {
    lessonData: {
      lessonUid: "LESSON-123",
    },
  } as unknown as LessonBrowseDataByKs["lessonData"];

  const restrictedLessonBrowseData: LessonBrowseDataByKs["lessonData"] = {
    lessonData: {
      lessonUid: "LESS-OIDMT-O3146", // This is in the restricted list
    },
  } as unknown as LessonBrowseDataByKs["lessonData"];

  const mockContent: LessonOverviewContent = {
    contentGuidance: null,
    isLegacy: false,
  } as LessonOverviewContent;

  const legacyContent: LessonOverviewContent = {
    contentGuidance: null,
    isLegacy: true,
  } as LessonOverviewContent;

  describe("when worksList is not empty", () => {
    it("should return true if worksList has items", () => {
      const worksList: WorksListItem[] = [{ id: "work1" }, { id: "work2" }];

      const result = isExcludedFromTeachingMaterials(
        mockBrowseData,
        worksList,
        mockContent,
      );

      expect(result).toBe(true);
    });

    it("should return true even if lesson ID is not restricted and no content guidance", () => {
      const worksList: WorksListItem[] = [{ id: "work1" }];

      const result = isExcludedFromTeachingMaterials(
        mockBrowseData,
        worksList,
        mockContent,
      );

      expect(result).toBe(true);
    });

    it("should return true even with restricted lesson ID", () => {
      const worksList: WorksListItem[] = [{ id: "work1" }];

      const result = isExcludedFromTeachingMaterials(
        restrictedLessonBrowseData,
        worksList,
        mockContent,
      );

      expect(result).toBe(true);
    });
  });

  describe("when worksList is empty", () => {
    const emptyWorksList: WorksListItem[] = [];

    it("should return true if lesson has restricted ID", () => {
      const result = isExcludedFromTeachingMaterials(
        restrictedLessonBrowseData,
        emptyWorksList,
        mockContent,
      );

      expect(result).toBe(true);
    });

    it("should return true if content guidance is restricted", () => {
      const contentWithGuidance: LessonOverviewContent = {
        ...mockContent,
        contentGuidance: [
          {
            contentguidanceLabel: "Depiction or discussion of sexual violence",
            contentguidanceDescription: null,
            contentguidanceArea: null,
          },
        ],
      };

      const result = isExcludedFromTeachingMaterials(
        mockBrowseData,
        emptyWorksList,
        contentWithGuidance,
      );

      expect(result).toBe(true);
    });

    it("should return true for other restricted content guidance types", () => {
      const contentGuidanceTypes = [
        "Depiction or discussion of sexual content",
        "Depiction or discussion of mental health issues",
        "Depiction or discussion of serious crime",
      ];

      contentGuidanceTypes.forEach((label) => {
        const contentWithGuidance: LessonOverviewContent = {
          ...mockContent,
          contentGuidance: [
            {
              contentguidanceLabel: label,
              contentguidanceDescription: null,
              contentguidanceArea: null,
            },
          ],
        };

        const result = isExcludedFromTeachingMaterials(
          mockBrowseData,
          emptyWorksList,
          contentWithGuidance,
        );

        expect(result).toBe(true);
      });
    });

    it("should return false if no restrictions apply", () => {
      const result = isExcludedFromTeachingMaterials(
        mockBrowseData,
        emptyWorksList,
        mockContent,
      );

      expect(result).toBe(false);
    });

    it("should return false if contentGuidance has non-restricted labels", () => {
      const contentWithSafeGuidance: LessonOverviewContent = {
        ...mockContent,
        contentGuidance: [
          {
            contentguidanceLabel: "Some safe content",
            contentguidanceDescription: null,
            contentguidanceArea: null,
          },
        ],
      };

      const result = isExcludedFromTeachingMaterials(
        mockBrowseData,
        emptyWorksList,
        contentWithSafeGuidance,
      );

      expect(result).toBe(false);
    });

    it("should return false if contentGuidance is empty array", () => {
      const contentWithEmptyGuidance: LessonOverviewContent = {
        ...mockContent,
        contentGuidance: [],
      };

      const result = isExcludedFromTeachingMaterials(
        mockBrowseData,
        emptyWorksList,
        contentWithEmptyGuidance,
      );

      expect(result).toBe(false);
    });

    it("should return false if contentGuidance has null labels", () => {
      const contentWithNullGuidance: LessonOverviewContent = {
        ...mockContent,
        contentGuidance: [
          {
            contentguidanceLabel: null,
            contentguidanceDescription: null,
            contentguidanceArea: null,
          },
        ],
      };

      const result = isExcludedFromTeachingMaterials(
        mockBrowseData,
        emptyWorksList,
        contentWithNullGuidance,
      );

      expect(result).toBe(false);
    });

    it("should return true if content is legacy", () => {
      const result = isExcludedFromTeachingMaterials(
        mockBrowseData,
        emptyWorksList,
        legacyContent,
      );

      expect(result).toBe(true);
    });
  });

  describe("combined scenarios", () => {
    it("should return true if multiple restrictions apply", () => {
      const worksList: WorksListItem[] = [{ id: "work1" }];
      const contentWithGuidance: LessonOverviewContent = {
        ...mockContent,
        contentGuidance: [
          {
            contentguidanceLabel: "Depiction or discussion of serious crime",
            contentguidanceDescription: null,
            contentguidanceArea: null,
          },
        ],
      };

      const result = isExcludedFromTeachingMaterials(
        restrictedLessonBrowseData,
        worksList,
        contentWithGuidance,
      );

      expect(result).toBe(true);
    });

    it("should return true if restricted lesson ID applies (even with safe content)", () => {
      const emptyWorksList: WorksListItem[] = [];
      const contentWithSafeGuidance: LessonOverviewContent = {
        ...mockContent,
        contentGuidance: [
          {
            contentguidanceLabel: "Some safe content",
            contentguidanceDescription: null,
            contentguidanceArea: null,
          },
        ],
      };

      const result = isExcludedFromTeachingMaterials(
        restrictedLessonBrowseData,
        emptyWorksList,
        contentWithSafeGuidance,
      );

      expect(result).toBe(true);
    });

    it("should return true if restricted content applies (even with safe lesson ID)", () => {
      const emptyWorksList: WorksListItem[] = [];
      const contentWithRestrictedGuidance: LessonOverviewContent = {
        ...mockContent,
        contentGuidance: [
          {
            contentguidanceLabel: "Depiction or discussion of sexual violence",
            contentguidanceDescription: null,
            contentguidanceArea: null,
          },
        ],
      };

      const result = isExcludedFromTeachingMaterials(
        mockBrowseData,
        emptyWorksList,
        contentWithRestrictedGuidance,
      );

      expect(result).toBe(true);
    });
  });

  describe("edge cases", () => {
    it("should handle mixed content guidance (some restricted, some not)", () => {
      const emptyWorksList: WorksListItem[] = [];
      const contentWithMixedGuidance: LessonOverviewContent = {
        ...mockContent,
        contentGuidance: [
          {
            contentguidanceLabel: "Some safe content",
            contentguidanceDescription: null,
            contentguidanceArea: null,
          },
          {
            contentguidanceLabel: "Depiction or discussion of sexual violence",
            contentguidanceDescription: null,
            contentguidanceArea: null,
          },
        ],
      };

      const result = isExcludedFromTeachingMaterials(
        mockBrowseData,
        emptyWorksList,
        contentWithMixedGuidance,
      );

      expect(result).toBe(true);
    });

    it("should handle case sensitivity in content guidance", () => {
      const emptyWorksList: WorksListItem[] = [];
      const contentWithUppercaseGuidance: LessonOverviewContent = {
        ...mockContent,
        contentGuidance: [
          {
            contentguidanceLabel: "DEPICTION OR DISCUSSION OF SEXUAL VIOLENCE",
            contentguidanceDescription: null,
            contentguidanceArea: null,
          },
        ],
      };

      const result = isExcludedFromTeachingMaterials(
        mockBrowseData,
        emptyWorksList,
        contentWithUppercaseGuidance,
      );

      // Should be false because the match is case-sensitive
      expect(result).toBe(false);
    });
  });
});
