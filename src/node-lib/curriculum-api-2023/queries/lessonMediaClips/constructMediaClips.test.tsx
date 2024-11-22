import { syntheticUnitvariantLessonsByKsFixture } from "@oaknational/oak-curriculum-schema";

import { constructCanonicalLessonMediaData } from "./constructCanonicalLessonMediaClips";
import { constructLessonMediaData } from "./constructLessonMediaClips";

import keysToCamelCase from "@/utils/snakeCaseConverter";

describe("constructMediaClips", () => {
  const fixture = syntheticUnitvariantLessonsByKsFixture({
    overrides: {
      lesson_slug: "running-as-a-team",
      unit_slug: "running-and-jumping",
      programme_slug: "physical-education-ks4",
      is_legacy: false,
    },
  });
  const lessonMediaClipsFixture = keysToCamelCase({
    ...fixture,
    supplementary_data: { order_in_unit: 0, unit_order: 0 },
  });

  describe("constructCanonicalLessonMediaData", () => {
    it("should construct CanonicalLessonMediaData correctly", () => {
      const result = constructCanonicalLessonMediaData(
        lessonMediaClipsFixture,
        [],
      );

      expect(result).toStrictEqual({
        programmeSlug: "physical-education-ks4",
        unitSlug: "running-and-jumping",
        unitTitle: "unit-title",
        keyStageSlug: "ks1",
        keyStageTitle: "Key stage 1",
        subjectSlug: "maths",
        subjectTitle: "Maths",
        yearTitle: "Year 1",
        examBoardTitle: null,
        updatedAt: "2024-02-28T08:09:20.247619+00:00",
        lessonSlug: "running-as-a-team",
        lessonTitle: "lesson-title",
        tierTitle: null,
        tierSlug: null,
        pathways: [],
      });
    });
  });

  describe("constructLessonMediaData", () => {
    it("should construct LessonMediaData correctly", () => {
      const result = constructLessonMediaData(lessonMediaClipsFixture);
      expect(result).toStrictEqual({
        programmeSlug: "physical-education-ks4",
        unitSlug: "running-and-jumping",
        unitTitle: "unit-title",
        keyStageSlug: "ks1",
        keyStageTitle: "Key stage 1",
        subjectSlug: "maths",
        subjectTitle: "Maths",
        yearTitle: "Year 1",
        examBoardTitle: null,
        updatedAt: "2024-02-28T08:09:20.247619+00:00",
        lessonSlug: "running-as-a-team",
        lessonTitle: "lesson-title",
        tierTitle: null,
        tierSlug: null,
      });
    });
  });
});
