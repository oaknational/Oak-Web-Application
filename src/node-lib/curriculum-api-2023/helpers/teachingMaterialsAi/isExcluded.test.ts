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
      const testCases = [
        {
          data: normalBrowseData,
          content: normalContent,
          description: "normal lesson and content",
        },
        {
          data: restrictedBrowseData,
          content: normalContent,
          description: "restricted lesson with normal content",
        },
        {
          data: normalBrowseData,
          content: legacyContent,
          description: "normal lesson with legacy content",
        },
      ];

      testCases.forEach(({ data, content }) => {
        const result = isExcludedFromTeachingMaterials(
          data,
          nonEmptyWorksList,
          content,
        );
        expect(result).toBe(true);
      });
    });

    it("should return true even with multiple works items", () => {
      const largeWorksList = Array.from({ length: 5 }, (_, i) => ({
        id: `work${i}`,
      }));

      const result = isExcludedFromTeachingMaterials(
        normalBrowseData,
        largeWorksList,
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
        const safeGuidanceLabels = [
          "General information about history",
          "Educational content about science",
          "Discussion of historical events",
          "", // empty string
        ];

        safeGuidanceLabels.forEach((safeLabel) => {
          const contentWithSafeGuidance = createContent({
            contentGuidance: [createContentGuidance(safeLabel)],
          });

          const result = isExcludedFromTeachingMaterials(
            normalBrowseData,
            emptyWorksList,
            contentWithSafeGuidance,
          );

          expect(result).toBe(false);
        });
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

    it("should return true if any single restriction applies", () => {
      const testScenarios = [
        {
          description: "only works list restriction",
          data: normalBrowseData,
          worksList: nonEmptyWorksList,
          content: normalContent,
        },
        {
          description: "only lesson ID restriction",
          data: restrictedBrowseData,
          worksList: emptyWorksList,
          content: normalContent,
        },
        {
          description: "only content guidance restriction",
          data: normalBrowseData,
          worksList: emptyWorksList,
          content: createContent({
            contentGuidance: [
              createContentGuidance(
                "Depiction or discussion of mental health issues",
              ),
            ],
          }),
        },
        {
          description: "only legacy content restriction",
          data: normalBrowseData,
          worksList: emptyWorksList,
          content: legacyContent,
        },
      ];

      testScenarios.forEach(({ data, worksList, content }) => {
        const result = isExcludedFromTeachingMaterials(
          data,
          worksList,
          content,
        );
        expect(result).toBe(true);
      });
    });

    it("should prioritize restricted lesson ID over safe content", () => {
      const safeContent = createContent({
        contentGuidance: [
          createContentGuidance("Educational historical content"),
        ],
      });

      const result = isExcludedFromTeachingMaterials(
        restrictedBrowseData,
        emptyWorksList,
        safeContent,
      );

      expect(result).toBe(true);
    });
  });

  describe("edge cases and boundary conditions", () => {
    it("should handle malformed lesson UID gracefully", () => {
      const malformedBrowseData = createBrowseData("");

      const result = isExcludedFromTeachingMaterials(
        malformedBrowseData,
        emptyWorksList,
        normalContent,
      );

      expect(result).toBe(false);
    });

    it("should handle very long content guidance arrays", () => {
      const largeGuidanceArray = Array.from({ length: 100 }, (_, i) =>
        createContentGuidance(`Safe content item ${i}`),
      );
      // Add one restricted item at the end
      largeGuidanceArray.push(
        createContentGuidance("Depiction or discussion of sexual content"),
      );

      const contentWithLargeGuidance = createContent({
        contentGuidance: largeGuidanceArray,
      });

      const result = isExcludedFromTeachingMaterials(
        normalBrowseData,
        emptyWorksList,
        contentWithLargeGuidance,
      );

      expect(result).toBe(true);
    });

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

    it("should handle works list with different object structures", () => {
      const diverseWorksList = [
        { id: "work1", type: "video" },
        { name: "work2", category: "worksheet" },
        { title: "work3", metadata: { type: "image" } },
      ];

      const result = isExcludedFromTeachingMaterials(
        normalBrowseData,
        diverseWorksList,
        normalContent,
      );

      expect(result).toBe(true);
    });
  });
});
