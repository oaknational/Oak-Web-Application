import {
  SyntheticUnitvariantLessons,
  syntheticUnitvariantLessonsFixture,
} from "@oaknational/oak-curriculum-schema";

import constructLessonDownloads from "./constructLessonDownloads";
import { downloadAssetsFixture } from "./downloadUtils.test";
import { LessonDownloadsListSchema } from "./lessonDownloads.schema";
import { RawSyntheticUVLesson } from "./rawSyntheticUVLesson.schema";

const getLessonWithOrder = (order: number) => {
  return {
    ...syntheticUnitvariantLessonsFixture({
      overrides: {
        lesson_slug: `lesson-${order}`,
      },
    }),
    order_in_unit: order,
  };
};
const downloads: LessonDownloadsListSchema =
  downloadAssetsFixture as LessonDownloadsListSchema;

describe("constructLessonDownloads", () => {
  it("should construct the expected object correctly", () => {
    const lessonSlug = "lesson-slug";
    const browse_data: SyntheticUnitvariantLessons[] = [
      syntheticUnitvariantLessonsFixture(),
    ];
    const expired = false;

    const result = constructLessonDownloads({
      downloads,
      lessonSlug,
      parsedBrowseData: browse_data,
      lessonCopyRight: null,
      expired,
    });

    const expectedResult = {
      downloads,
      programmeSlug: "programme-slug",
      keyStageSlug: "ks1",
      keyStageTitle: "Key stage 1",
      lessonSlug: "lesson-slug",
      lessonTitle: "lesson-title",
      subjectSlug: "maths",
      subjectTitle: "Maths",
      unitSlug: "unit-slug",
      unitTitle: "unit-title",
      lessonCohort: "2023-2024",
      expired: null,
      updatedAt: "2024-02-28T08:09:20.247619+00:00",
      copyrightContent: null,
      nextLessons: [],
      tierTitle: null,
      examBoardTitle: null,
      pathwayTitle: null,
    };

    expect(result).toEqual(expectedResult);
  });
  it("should return the correct next lessons when there are 3", () => {
    const lessonSlug = "lesson-1";

    const browse_data: RawSyntheticUVLesson[] = [
      getLessonWithOrder(1),
      getLessonWithOrder(2),
      getLessonWithOrder(3),
      getLessonWithOrder(4),
    ];
    const expired = false;

    const result = constructLessonDownloads({
      downloads,
      lessonSlug,
      parsedBrowseData: browse_data,
      lessonCopyRight: null,
      expired,
    });

    expect(result.nextLessons).toEqual([
      { lessonSlug: "lesson-2", lessonTitle: "lesson-title" },
      { lessonSlug: "lesson-3", lessonTitle: "lesson-title" },
      { lessonSlug: "lesson-4", lessonTitle: "lesson-title" },
    ]);
  });
  it("should return the correct next lessons when there are less than 3", () => {
    const lessonSlug = "lesson-3";
    const browse_data: RawSyntheticUVLesson[] = [
      getLessonWithOrder(1),
      getLessonWithOrder(2),
      getLessonWithOrder(3),
      getLessonWithOrder(4),
      getLessonWithOrder(5),
    ];

    const result = constructLessonDownloads({
      downloads,
      lessonSlug,
      parsedBrowseData: browse_data,
      lessonCopyRight: null,
      expired: false,
    });

    expect(result.nextLessons).toEqual([
      { lessonSlug: "lesson-4", lessonTitle: "lesson-title" },
      { lessonSlug: "lesson-5", lessonTitle: "lesson-title" },
    ]);
  });
  it("should return next lessons when order in unit is not sequential", () => {
    const lessonSlug = "lesson-2";
    const browse_data: RawSyntheticUVLesson[] = [
      getLessonWithOrder(2),
      getLessonWithOrder(6),
      getLessonWithOrder(4),
      getLessonWithOrder(9),
    ];
    const result = constructLessonDownloads({
      downloads,
      lessonSlug,
      parsedBrowseData: browse_data,
      lessonCopyRight: null,
      expired: false,
    });

    expect(result.nextLessons).toEqual([
      { lessonSlug: "lesson-4", lessonTitle: "lesson-title" },
      { lessonSlug: "lesson-6", lessonTitle: "lesson-title" },
      { lessonSlug: "lesson-9", lessonTitle: "lesson-title" },
    ]);
  });
});
