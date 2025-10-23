import { CreateLessonAttemptPayload } from "@/node-lib/pupil-api/_types/lessonAttemptTypes";

export const LessonAttemptFixture = (
  partial?: Partial<CreateLessonAttemptPayload>,
): CreateLessonAttemptPayload => {
  return {
    attempt_id: "sNHeiaNYiplPq62goZXUM",
    lesson_data: {
      title: "learning stuff",
      slug: "learning_stuff_2321",
    },
    browse_data: {
      subject: "english",
      year_description: "year_9",
    },
    section_results: {
      intro: {
        worksheet_downloaded: true,
        worksheet_available: true,
        is_complete: true,
      },
      "starter-quiz": {},
      video: {
        is_complete: true,
        played: true,
        duration: 100,
        time_elapsed: 100,
        muted: true,
        signed_opened: true,
        transcript_opened: true,
      },
      "exit-quiz": {},
    },
    ...partial,
  };
};
