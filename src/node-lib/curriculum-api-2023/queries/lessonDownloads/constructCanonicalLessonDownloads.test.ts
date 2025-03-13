import {
  SyntheticUnitvariantLessons,
  syntheticUnitvariantLessonsFixture,
} from "@oaknational/oak-curriculum-schema";

import { LessonDownloadsListSchema } from "./lessonDownloads.schema";
import constructCanonicalLessonDownloads from "./constructCanonicalLessonDownloads";
import { downloadAssetsFixture } from "./downloadUtils.test";
import { LessonDownloadsCanonical } from "./lessonDownloadsCanonical.schema";

describe("constructCanonicalLessonDownloads", () => {
  it("should construct LessonDownloadsCanonical correctly", () => {
    const downloads: LessonDownloadsListSchema =
      downloadAssetsFixture as LessonDownloadsListSchema;
    const lessonSlug = "lesson-slug";
    const browseData: SyntheticUnitvariantLessons[] = [
      syntheticUnitvariantLessonsFixture({
        overrides: {
          lesson_data: {
            lesson_id: 1,
            lesson_uid: "lesson-uid",
            title: "lesson-title",
            description: "lesson-description",
            slug: "lesson-slug",
            pupil_lesson_outcome: "pupil-lesson-outcome",
            phonics_outcome: null,
            key_learning_points: [Array],
            equipment_and_resources: null,
            content_guidance_details: null,
            content_guidance: null,
            supervision_level: null,
            thirdpartycontent_list: null,
            misconceptions_and_common_mistakes: null,
            keywords: null,
            video_id: null,
            sign_language_video_id: null,
            quiz_id_starter: null,
            quiz_id_exit: null,
            asset_id_slidedeck: null,
            asset_id_worksheet: null,
            copyright_content: null,
            _state: "published",
            _cohort: "2023-2024",
            deprecated_fields: null,
            updated_at: "2024-02-28T08:09:20.247619+00:00",
            expiration_date: null,
          },
        },
      }),
    ];
    const isLegacy = false;

    const result: LessonDownloadsCanonical = constructCanonicalLessonDownloads({
      downloads,
      lessonSlug,
      browseData,
      isLegacy,
      lessonCopyRight: null,
      restrictions: { geoRestricted: false, loginRequired: false },
    });

    const expectedResult: LessonDownloadsCanonical = {
      downloads: downloads,
      additionalFiles: [],
      isLegacy: isLegacy,
      lessonSlug: lessonSlug,
      lessonTitle: browseData[0]?.lesson_data?.title ?? "",
      expired: null,
      isSpecialist: false,
      updatedAt: browseData[0]?.lesson_data?.updated_at ?? "",
      copyrightContent: null,
      geoRestricted: false,
      loginRequired: false,
      pathways: [
        {
          programmeSlug: "programme-slug",
          unitSlug: "unit-slug",
          unitTitle: "unit-title",
          keyStageSlug: "ks1",
          keyStageTitle: "Key stage 1",
          subjectSlug: "maths",
          subjectTitle: "Maths",
          lessonCohort: "2023-2024",
          examBoardSlug: null,
          examBoardTitle: null,
          tierSlug: null,
          tierTitle: null,
        },
      ],
    };

    expect(result).toEqual(expectedResult);
  });

  it("should construct LessonDownloadsCanonical correctly with multiple pathways", () => {
    const downloads: LessonDownloadsListSchema =
      downloadAssetsFixture as LessonDownloadsListSchema;
    const lessonSlug = "lesson-slug";
    const browseData: SyntheticUnitvariantLessons[] = [
      syntheticUnitvariantLessonsFixture({
        overrides: {
          lesson_data: {
            lesson_id: 1,
            lesson_uid: "lesson-uid",
            title: "lesson-title",
            description: "lesson-description",
            slug: "lesson-slug",
            pupil_lesson_outcome: "pupil-lesson-outcome",
            phonics_outcome: null,
            key_learning_points: [Array],
            equipment_and_resources: null,
            content_guidance_details: null,
            content_guidance: null,
            supervision_level: null,
            thirdpartycontent_list: null,
            misconceptions_and_common_mistakes: null,
            keywords: null,
            video_id: null,
            sign_language_video_id: null,
            quiz_id_starter: null,
            quiz_id_exit: null,
            asset_id_slidedeck: null,
            asset_id_worksheet: null,
            copyright_content: null,
            _state: "published",
            _cohort: "2023-2024",
            deprecated_fields: null,
            updated_at: "2024-02-28T08:09:20.247619+00:00",
            expiration_date: null,
          },
        },
      }),
      syntheticUnitvariantLessonsFixture({
        overrides: {
          lesson_slug: "lesson-slug-2",
          lesson_data: {
            lesson_id: 1,
            lesson_uid: "lesson-uid",
            title: "lesson-title-2",
            description: "lesson-description-2",
            slug: "lesson-slug",
            pupil_lesson_outcome: "pupil-lesson-outcome",
            phonics_outcome: null,
            key_learning_points: [{}],
            equipment_and_resources: null,
            content_guidance_details: null,
            content_guidance: null,
            supervision_level: null,
            thirdpartycontent_list: null,
            misconceptions_and_common_mistakes: null,
            keywords: null,
            video_id: null,
            sign_language_video_id: null,
            quiz_id_starter: null,
            quiz_id_exit: null,
            asset_id_slidedeck: null,
            asset_id_worksheet: null,
            copyright_content: null,
            _state: "published",
            _cohort: "2023-2024",
            updated_at: "2023-01-01T00:00:00.000Z",
            deprecated_fields: null,
            expiration_date: null,
          },
        },
      }),
    ];
    const isLegacy = false;

    const result: LessonDownloadsCanonical = constructCanonicalLessonDownloads({
      downloads,
      lessonSlug,
      browseData,
      isLegacy,
      lessonCopyRight: null,
      restrictions: { geoRestricted: false, loginRequired: false },
    });

    const expectedResult: LessonDownloadsCanonical = {
      downloads: downloads,
      additionalFiles: [],
      isLegacy: isLegacy,
      lessonSlug: lessonSlug,
      lessonTitle: browseData[0]?.lesson_data?.title ?? "",
      expired: null,
      isSpecialist: false,
      updatedAt: browseData[0]?.lesson_data?.updated_at ?? "",
      copyrightContent: null,
      geoRestricted: false,
      loginRequired: false,
      pathways: [
        {
          programmeSlug: "programme-slug",
          unitSlug: "unit-slug",
          unitTitle: "unit-title",
          keyStageSlug: "ks1",
          keyStageTitle: "Key stage 1",
          subjectSlug: "maths",
          subjectTitle: "Maths",
          lessonCohort: "2023-2024",
          examBoardSlug: null,
          examBoardTitle: null,
          tierSlug: null,
          tierTitle: null,
        },
        {
          programmeSlug: "programme-slug",
          unitSlug: "unit-slug",
          unitTitle: "unit-title",
          keyStageSlug: "ks1",
          keyStageTitle: "Key stage 1",
          subjectSlug: "maths",
          subjectTitle: "Maths",
          lessonCohort: "2023-2024",
          examBoardSlug: null,
          examBoardTitle: null,
          tierSlug: null,
          tierTitle: null,
        },
      ],
    };

    expect(result).toEqual(expectedResult);
  });
});
