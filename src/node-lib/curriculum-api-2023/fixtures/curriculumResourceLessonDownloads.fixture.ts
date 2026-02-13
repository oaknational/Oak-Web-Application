import type { LessonAssets } from "@/node-lib/curriculum-api-2023/queries/curriculumResourcesDownloads/lessonAssets.schema";
const curriculumResourceLessonDownloadsFixture = (
  partial?: Partial<LessonAssets>,
): LessonAssets => {
  return {
    slug: "lesson-slug",
    asset_slidedeck: {
      asset_type: "slidedeck",
      asset_uid: "slidedeck-123",
      updated_at: "2024-01-01T00:00:00.000Z",
      asset_object: {
        powerpoint: {
          bucket_name: "bucket--ingested-assets",
          bucket_path: "slidedecks/presentation.pptx",
        },
        pdf: {
          bucket_name: "bucket--ingested-assets",
          bucket_path: "slidedecks/presentation.pdf",
        },
      },
    },
    asset_worksheet: {
      asset_type: "worksheet",
      asset_uid: "worksheet-123",
      updated_at: "2024-01-01T00:00:00.000Z",
      asset_object: {
        pdf: {
          bucket_name: "bucket--ingested-assets",
          bucket_path: "worksheets/worksheet.pdf",
        },
        powerpoint: {
          bucket_name: "bucket--ingested-assets",
          bucket_path: "worksheets/worksheet.pptx",
        },
      },
    },
    asset_worksheet_answers: {
      asset_type: "worksheet_answers",
      asset_uid: "worksheet-answers-123",
      updated_at: "2024-01-01T00:00:00.000Z",
      asset_object: {
        pdf: {
          bucket_name: "bucket--ingested-assets",
          bucket_path: "worksheets/worksheet-answers.pdf",
        },
      },
    },
    asset_supplementary_asset: {
      asset_uid: "asset_uid",
      asset_object: {
        pdf: {
          bucket_name: "bucket--ingested-assets",
          bucket_path: "supplementary-worksheets/supplementary-worksheet.pdf",
        },
        word: {
          bucket_name: "bucket--ingested-assets",
          bucket_path: "supplementary-worksheets/supplementary-worksheet.docx",
        },
      },
      updated_at: "2023-01-01T00:00:00.000Z",
      asset_type: "supplementary_resource",
    },
    quiz_exit: {
      quiz_uid: "quiz_uid",
      quiz_object: {
        quiz: {
          pdf: {
            bucket_name: "bucket--ingested-assets",
            bucket_path: "quiz-exit-questions-url.pdf",
          },
        },
        quiz_answers: {
          pdf: {
            bucket_name: "bucket--ingested-assets",
            bucket_path: "quiz-exit-answers-url.pdf",
          },
        },
      },
      updated_at: "2023-01-01T00:00:00.000Z",
    },
    quiz_starter: {
      quiz_uid: "quiz_uid",
      quiz_object: {
        quiz: {
          pdf: {
            bucket_name: "bucket--ingested-assets",
            bucket_path: "quiz-starter-questions-url.pdf",
          },
        },
        quiz_answers: {
          pdf: {
            bucket_name: "bucket--ingested-assets",
            bucket_path: "quiz-starter-answers-url.pdf",
          },
        },
      },
      updated_at: "2023-01-01T00:00:00.000Z",
    },
    asset_lesson_guide: {
      updated_at: "2023-01-01T00:00:00.000Z",
      asset_type: "lesson_guide",
      url: "https://drive.google.com/lesson-guide-url",
      asset_uid: "asset_uid",
      asset_object: {
        pdf: {
          bucket_name: "bucket--ingested-assets",
          bucket_path: "lesson-guide/lesson-guide.pdf",
        },
        word: {
          bucket_name: "bucket--ingested-assets",
          bucket_path: "lesson-guide/lesson-guide.docx",
        },
      },
    },
    tpc_downloadablefiles: [
      {
        asset_id: 123,
        media_object: {
          display_name: "Sample Additional File",
        },
      },
      {
        asset_id: 345,
        media_object: {
          display_name: "Sample Additional File 2",
        },
      },
    ],
    features: {
      agf__geo_restricted: false,
      agf__login_required: false,
    },
    ...partial,
  };
};

export default curriculumResourceLessonDownloadsFixture;
