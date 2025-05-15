import {
  SpecialistLessonDataRaw,
  SpecialistLessonOverviewData,
} from "@/node-lib/curriculum-api-2023/queries/specialistLessonOverview/specialistLessonOverview.schema";

export const specialistLessonOverviewRawFixture = (
  partial?: Partial<SpecialistLessonDataRaw>,
): SpecialistLessonDataRaw => {
  return [
    {
      combined_programme_fields: {
        phase_slug: "primary",
        subject: "Communication and language",
        subject_slug: "communication-and-language",
        developmentstage: "Applying learning",
        phase_description: "Primary",
        developmentstage_slug: "applying-learning",
      },
      contains_copyright_content: false,
      content_guidance: null,
      equipment_and_resources: [
        {
          equipment: "ruler, plain flour, butter, jam, cutters, tin",
        },
      ],
      exit_quiz: null,
      expired: null,
      key_learning_points: [
        {
          key_learning_point:
            "How to write a simple recipe for your favourite festival food",
        },
      ],
      lesson_slug: "composition-following-a-recipe-ccrk2r",
      lesson_title: "Composition: Following a Recipe",
      misconceptions_and_common_mistakes: null,
      presentation_url:
        "https://docs.google.com/presentation/d/18ZFU8gdczMK9U3XxmC5mN9GLN7yigCQvbSX1E0SR0WU/embed?start=false&amp;loop=false&amp",
      pupil_lesson_outcome:
        "This lesson is a resource pack. In this lesson, we will create a writing frame for a simple recipe, jam tarts. We will write the recipe in steps using either symbols or written words. We will then follow the recipe to make the jam tarts.",
      starter_quiz: null,
      supervision_level: "Adult support required.",
      synthetic_programme_slug: "communication-and-language-applying-learning",
      teacher_tips: null,
      threads: null,
      transcript_sentences: ["this is a sentence", "this is another sentence"],
      unit_slug: "celebrations-and-festivals-primary-1f8f",
      unit_title: "Celebrations and Festivals (Primary)",
      video_mux_playback_id: null,
      video_title: null,
      video_with_sign_language_mux_playback_id: null,
      worksheet_url:
        "https://docs.google.com/presentation/d/1gjXZk0ylpz--95u4cIpTN6UPfEnWoIk6xH6pW23_mqY/embed?start=false&amp;loop=false&amp",
      lesson_release_date: "2022-02-01T00:00:00Z",
      ...partial,
    },
  ];
};

const specialistLessonOverviewFixture = (
  partial?: Partial<SpecialistLessonOverviewData>,
): SpecialistLessonOverviewData => {
  return {
    isLegacy: true,
    isCanonical: false,
    phaseSlug: "primary",
    phaseTitle: "Primary",
    developmentStageSlug: "applying-learning",
    developmentStageTitle: "Applying learning",
    subjectTitle: "Communication and language",
    subjectSlug: "communication-and-language",
    copyrightContent: null,
    contentGuidance: null,
    lessonEquipmentAndResources: [
      {
        equipment: "ruler, plain flour, butter, jam, cutters, tin",
      },
    ],
    exitQuiz: null,
    expired: null,
    keyLearningPoints: [
      {
        keyLearningPoint:
          "How to write a simple recipe for your favourite festival food",
      },
    ],
    lessonSlug: "composition-following-a-recipe-ccrk2r",
    lessonTitle: "Composition: Following a Recipe",
    misconceptionsAndCommonMistakes: null,
    presentationUrl:
      "https://docs.google.com/presentation/d/18ZFU8gdczMK9U3XxmC5mN9GLN7yigCQvbSX1E0SR0WU/embed?start=false&amp;loop=false&amp",
    worksheetUrl:
      "https://docs.google.com/presentation/d/1gjXZk0ylpz--95u4cIpTN6UPfEnWoIk6xH6pW23_mqY/embed?start=false&amp;loop=false&amp",
    pupilLessonOutcome:
      "This lesson is a resource pack. In this lesson, we will create a writing frame for a simple recipe, jam tarts. We will write the recipe in steps using either symbols or written words. We will then follow the recipe to make the jam tarts.",
    starterQuiz: null,
    supervisionLevel: "Adult support required.",
    programmeSlug: "communication-and-language-applying-learning",
    teacherTips: null,
    threads: null,
    transcriptSentences: ["this is a sentence", "this is another sentence"],
    unitSlug: "celebrations-and-festivals-primary-1f8f",
    unitTitle: "Celebrations and Festivals (Primary)",
    videoMuxPlaybackId: null,
    videoTitle: null,
    videoWithSignLanguageMuxPlaybackId: null,
    downloads: [
      { exists: true, type: "intro-quiz-answers" },
      { exists: true, type: "intro-quiz-questions" },
      { exists: true, type: "exit-quiz-answers" },
      { exists: true, type: "exit-quiz-questions" },
      { exists: true, type: "worksheet-pdf" },
      { exists: true, type: "worksheet-pptx" },
      { exists: true, type: "presentation" },
    ],
    updatedAt: "2022-02-01T00:00:00Z",
    pathways: [],
    lessonGuideUrl: null,
    hasMediaClips: false,
    lessonMediaClips: null,
    additionalFiles: null,
    lessonOutline: null,
    lessonReleaseDate: "2022-02-01T00:00:00Z",
    ...partial,
  };
};

export default specialistLessonOverviewFixture;
