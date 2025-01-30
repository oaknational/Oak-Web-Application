import {
  SyntheticUnitvariantLessons,
  syntheticUnitvariantLessonsFixture,
} from "@oaknational/oak-curriculum-schema";

import constructLessonDownloads from "./constructLessonDownloads";
import { downloadAssetsFixture } from "./downloadUtils.test";
import { LessonDownloadsListSchema } from "./lessonDownloads.schema";

describe("constructLessonDownloads", () => {
  it("should construct the expected object correctly", () => {
    const downloads: LessonDownloadsListSchema =
      downloadAssetsFixture as LessonDownloadsListSchema;
    const lessonSlug = "lesson-slug";
    const browse_data: SyntheticUnitvariantLessons[] = [
      syntheticUnitvariantLessonsFixture(),
    ];
    const expired = false;

    const result = constructLessonDownloads(
      downloads,
      lessonSlug,
      browse_data,
      null,
      null,
      expired,
    );

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
      additionalFilesDownloads: null,
    };

    expect(result).toEqual(expectedResult);
  });
});
