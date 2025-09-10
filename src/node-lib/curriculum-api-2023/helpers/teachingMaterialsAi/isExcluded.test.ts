import type {
  LessonBrowseDataByKs,
  LessonOverviewContent,
} from "../../queries/lessonOverview/lessonOverview.schema";

import { isExcludedFromTeachingMaterials } from "./isExcluded";

interface WorksListItem {
  [key: string]: unknown;
}

describe("isExcludedFromTeachingMaterials", () => {
  // Test fixtures
  const createBrowseData = (
    lessonUid: string,
  ): LessonBrowseDataByKs["lessonData"] =>
    ({
      lessonUid,
    }) as LessonBrowseDataByKs["lessonData"];

  const createContent = (
    overrides: Partial<LessonOverviewContent> = {},
  ): LessonOverviewContent =>
    ({
      contentGuidance: null,
      isLegacy: false,
      ...overrides,
    }) as LessonOverviewContent;

  const createContentGuidance = (label: string) => ({
    contentguidanceLabel: label,
    contentguidanceDescription: null,
    contentguidanceArea: null,
  });

  // Test data
  const normalLessonUid = "LESSON-NORMAL-123";
  const restrictedLessonUid = "LESS-OIDMT-O3146"; // Known restricted lesson ID
  const emptyWorksList: WorksListItem[] = [];
  const nonEmptyWorksList: WorksListItem[] = [{ id: "work1" }, { id: "work2" }];

  const restrictedContentGuidanceLabels = [
    "Depiction or discussion of sexual violence",
    "Depiction or discussion of sexual content",
    "Depiction or discussion of mental health issues",
    "Depiction or discussion of serious crime",
  ];

  const normalBrowseData = createBrowseData(normalLessonUid);
  const restrictedBrowseData = createBrowseData(restrictedLessonUid);
  const normalContent = createContent();
  const legacyContent = createContent({ isLegacy: true });

  describe("when worksList contains items (should always exclude)", () => {
    it("should return true regardless of other conditions", () => {
      const result = isExcludedFromTeachingMaterials(
        normalBrowseData,
        nonEmptyWorksList,
        normalContent,
      );
      expect(result).toBe(true);
    });
  });

  describe("when worksList is empty", () => {
    describe("restricted lesson IDs", () => {
      it("should return true for known restricted lesson ID", () => {
        const result = isExcludedFromTeachingMaterials(
          restrictedBrowseData,
          emptyWorksList,
          normalContent,
        );

        expect(result).toBe(true);
      });

      it("should return false for normal lesson ID", () => {
        const result = isExcludedFromTeachingMaterials(
          normalBrowseData,
          emptyWorksList,
          normalContent,
        );

        expect(result).toBe(false);
      });
    });

    describe("content guidance restrictions", () => {
      describe.each(restrictedContentGuidanceLabels)(
        "should exclude content with guidance: %s",
        (restrictedLabel) => {
          it("should return true", () => {
            const contentWithRestrictedGuidance = createContent({
              contentGuidance: [createContentGuidance(restrictedLabel)],
            });

            const result = isExcludedFromTeachingMaterials(
              normalBrowseData,
              emptyWorksList,
              contentWithRestrictedGuidance,
            );

            expect(result).toBe(true);
          });
        },
      );

      it("should return false for non-restricted content guidance", () => {
        const contentWithSafeGuidance = createContent({
          contentGuidance: [createContentGuidance("Safe educational content")],
        });

        const result = isExcludedFromTeachingMaterials(
          normalBrowseData,
          emptyWorksList,
          contentWithSafeGuidance,
        );

        expect(result).toBe(false);
      });

      it("should return true when any guidance item is restricted (mixed content)", () => {
        const mixedGuidance = [
          createContentGuidance("Safe educational content"),
          createContentGuidance("Depiction or discussion of sexual violence"), // restricted
          createContentGuidance("Another safe topic"),
        ];

        const contentWithMixedGuidance = createContent({
          contentGuidance: mixedGuidance,
        });

        const result = isExcludedFromTeachingMaterials(
          normalBrowseData,
          emptyWorksList,
          contentWithMixedGuidance,
        );

        expect(result).toBe(true);
      });

      it("should return false for empty content guidance array", () => {
        const contentWithEmptyGuidance = createContent({
          contentGuidance: [],
        });

        const result = isExcludedFromTeachingMaterials(
          normalBrowseData,
          emptyWorksList,
          contentWithEmptyGuidance,
        );

        expect(result).toBe(false);
      });

      it("should return false for null content guidance", () => {
        const contentWithNullGuidance = createContent({
          contentGuidance: null,
        });

        const result = isExcludedFromTeachingMaterials(
          normalBrowseData,
          emptyWorksList,
          contentWithNullGuidance,
        );

        expect(result).toBe(false);
      });

      it("should handle null guidance labels gracefully", () => {
        const contentWithNullLabels = createContent({
          contentGuidance: [
            {
              contentguidanceLabel: null,
              contentguidanceDescription: null,
              contentguidanceArea: null,
            },
          ],
        });

        const result = isExcludedFromTeachingMaterials(
          normalBrowseData,
          emptyWorksList,
          contentWithNullLabels,
        );

        expect(result).toBe(false);
      });
    });

    describe("legacy content", () => {
      it("should return true for legacy content", () => {
        const result = isExcludedFromTeachingMaterials(
          normalBrowseData,
          emptyWorksList,
          legacyContent,
        );

        expect(result).toBe(true);
      });

      it("should return true for legacy content even with safe guidance", () => {
        const legacyContentWithSafeGuidance = createContent({
          isLegacy: true,
          contentGuidance: [createContentGuidance("Safe educational content")],
        });

        const result = isExcludedFromTeachingMaterials(
          normalBrowseData,
          emptyWorksList,
          legacyContentWithSafeGuidance,
        );

        expect(result).toBe(true);
      });

      it("should handle undefined isLegacy as false", () => {
        const contentWithUndefinedLegacy = createContent();
        // Create content without isLegacy property to test undefined case
        const { isLegacy, ...contentWithoutLegacy } =
          contentWithUndefinedLegacy;

        const result = isExcludedFromTeachingMaterials(
          normalBrowseData,
          emptyWorksList,
          contentWithoutLegacy as LessonOverviewContent,
        );

        expect(result).toBe(false);
      });
    });

    it("should return false when no exclusion criteria are met", () => {
      const result = isExcludedFromTeachingMaterials(
        normalBrowseData,
        emptyWorksList,
        normalContent,
      );

      expect(result).toBe(false);
    });
  });

  describe("multiple restriction scenarios", () => {
    it("should return true when multiple restrictions apply simultaneously", () => {
      const multipleRestrictionsContent = createContent({
        isLegacy: true,
        contentGuidance: [
          createContentGuidance("Depiction or discussion of serious crime"),
        ],
      });

      const result = isExcludedFromTeachingMaterials(
        restrictedBrowseData, // restricted lesson ID
        nonEmptyWorksList, // non-empty works list
        multipleRestrictionsContent, // legacy + restricted content guidance
      );

      expect(result).toBe(true);
    });
  });

  describe("edge cases and boundary conditions", () => {
    it("should handle content guidance with special characters", () => {
      const specialCharacterGuidance = createContent({
        contentGuidance: [
          createContentGuidance("Content with special chars: !@#$%^&*()"),
        ],
      });

      const result = isExcludedFromTeachingMaterials(
        normalBrowseData,
        emptyWorksList,
        specialCharacterGuidance,
      );

      expect(result).toBe(false);
    });
  });
});
