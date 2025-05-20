import {
  SpecialistLessonDownloadRaw,
  SpecialistLessonDownloads,
} from "../queries/specialistLessonDownload/specialistLessonDownload.schema";

export const SpecialistLessonDownloadFixture = (
  partialLesson?: Partial<SpecialistLessonDownloads["lesson"]>,
): SpecialistLessonDownloads => {
  return {
    lesson: {
      updatedAt: "2021-09-29T14:00:00Z",
      lessonTitle: "Online safety",
      isSpecialist: true,
      subjectTitle: "Independent Living",
      subjectSlug: "independent-living",
      unitTitle: "Staying Safe - AL",
      unitSlug: "staying-safe-al",
      programmeSlug: "independent-living",
      isLegacy: false,
      lessonReleaseDate: "2025-09-29T14:00:00.000Z",
      lessonSlug: "staying-safe-al",
      downloads: [
        {
          type: "presentation",
          exists: true,
          forbidden: false,
          ext: "pptx",
          label: "Slide deck",
        },
      ],
      additionalFiles: [],
      nextLessons: [
        {
          lessonSlug: "test",
          lessonTitle: "test",
        },
      ],
      expired: false,
      geoRestricted: false,
      loginRequired: false,
      ...partialLesson,
    },
  };
};

export const SpecialistLessonDownloadRawFixture = (
  partial?: Partial<SpecialistLessonDownloadRaw>,
): SpecialistLessonDownloadRaw => {
  return {
    lesson_title: "Online safety",
    combined_programme_fields: {
      subject: "Independent Living",
      subject_slug: "independent-living",
      developmentstage: "Applying learning",
      developmentstage_slug: "applying-learning",
    },
    unit_title: "Staying Safe - AL",
    expired: null,
    contains_copyright_content: false,
    exit_quiz: null,
    starter_quiz: null,
    pupil_lesson_outcome: "In this lesson, we will learn about...",
    worksheet_asset_object: {
      google_drive: {
        id: "test_id",
        url: "https://docs.google.com/presentation/d/test_id/",
      },
      google_drive_downloadable_version: {
        id: "test_id",
        url: "https://docs.google.com/presentation/d/test_id/",
      },
    },
    worksheet_url: "https://docs.google.com/presentation/d/test_id",
    video_mux_playback_id: null,
    video_title: null,
    exit_quiz_asset_object: null,
    presentation_url: "https://docs.google.com/presentation/d/test_id",
    slidedeck_asset_object: {
      google_drive: {
        id: "test_id",
        url: "https://docs.google.com/presentation/d/test_id",
      },
    },
    starter_quiz_asset_object: null,
    ...partial,
  };
};
