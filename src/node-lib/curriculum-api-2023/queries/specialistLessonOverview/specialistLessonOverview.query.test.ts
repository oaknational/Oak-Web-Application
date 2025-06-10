import sdk from "../../sdk";

import specialistLessonOverview from "./specialistLessonOverview.query";

describe("specialistLessonOverview()", () => {
  test("throws a not found error if no lesson is found", async () => {
    await expect(async () => {
      await specialistLessonOverview({
        ...sdk,
        specialistLessonOverview: jest.fn(() =>
          Promise.resolve({ lesson: [], allLessons: [] }),
        ),
      })({
        lessonSlug: "specialist-lesson-slug",
        unitSlug: "specialist-unit-slug",
        programmeSlug: "specialist-programme-slug",
      });
    }).rejects.toThrow(`Resource not found`);
  });

  test("first lesson is returned if multiple units in response", async () => {
    const lesson = await specialistLessonOverview({
      ...sdk,
      specialistLessonOverview: jest.fn(() =>
        Promise.resolve({
          lesson: [
            {
              synthetic_programme_slug: "specialist-programme-slug-0",
              combined_programme_fields: {
                phase_slug: "specialist-phase-slug",
                phase_description: "specialist-phase-description",
                developmentstage_slug: "specialist-development-stage-slug",
                developmentstage: "specialist-development-stage",
                subject: "Specialist subject",
                subject_slug: "specialist-subject-slug",
              },
              unit_slug: "specialist-unit-slug",
              unit_title: "specialist-unit-title",
              subject_slug: "specialist-subject-slug",
              subject_title: "specialist-subject-title",
              key_stage_slug: "specialist-key-stage-slug",
              key_stage_title: "specialist-key-stage-title",
              lesson_slug: "specialist-lesson-slug",
              lesson_title: "specialist-lesson-title",
              additional_material_url: "specialist-supplementary-assets-url",
              supervision_level: "specialist-supervision-level",
              presentation_url: "specialist-presentation-url",
              worksheet_url: "specialist-worksheet-url",
              video_with_sign_language: "specialist-video-with-sign-language",
              transcript_sentences: null,
              video_mux_playback_id: "specialist-video-mux-playback-id",
              video_with_sign_language_mux_playback_id:
                "specialist-video-with-sign-language-mux-playback-id",
              has_downloadable_resources: false,
              expired: false,
              pupil_lesson_outcome: "specialist-pupil-lesson-outcome",
              key_learning_points: null,
              contains_copyright_content: false,
              misconceptions_and_common_mistakes: null,
              teacher_tips: null,
              content_guidance: null,
              threads: null,
              video_title: null,
              additional_files: null,
              lesson_release_date: "2025-09-29T14:00:00.000Z",
              order_in_unit: 1,
            },
            {
              synthetic_programme_slug: "specialist-programme-slug-0",
              combined_programme_fields: {
                phase_slug: "specialist-phase-slug",
                phase_description: "specialist-phase-description",
                developmentstage_slug: "specialist-development-stage-slug",
                developmentstage: "specialist-development-stage",
                subject: "Specialist subject",
                subject_slug: "specialist-subject-slug",
              },
              unit_slug: "specialist-unit-slug",
              unit_title: "specialist-unit-title",
              subject_slug: "specialist-subject-slug",
              subject_title: "specialist-subject-title",
              key_stage_slug: "specialist-key-stage-slug",
              key_stage_title: "specialist-key-stage-title",
              lesson_slug: "specialist-lesson-slug",
              lesson_title: "specialist-lesson-title",
              additional_material_url: "specialist-supplementary-assets-url",
              supervision_level: "specialist-supervision-level",
              presentation_url: "specialist-presentation-url",
              worksheet_url: "specialist-worksheet-url",
              video_with_sign_language: "specialist-video-with-sign-language",
              transcript_sentences: null,
              video_mux_playback_id: "specialist-video-mux-playback-id",
              video_with_sign_language_mux_playback_id:
                "specialist-video-with-sign-language-mux-playback-id",
              has_downloadable_resources: false,
              expired: false,
              pupil_lesson_outcome: "specialist-pupil-lesson-outcome",
              key_learning_points: null,
              contains_copyright_content: false,
              misconceptions_and_common_mistakes: null,
              teacher_tips: null,
              content_guidance: null,
              threads: null,
              video_title: null,
              lesson_release_date: "2025-09-29T14:00:00.000Z",
              order_in_unit: 2,
            },
          ],
          allLessons: [
            {
              lesson_slug: "specialist-lesson-slug",
              lesson_title: "specialist-lesson-title",
            },
            {
              lesson_slug: "specialist-lesson-slug",
              lesson_title: "specialist-lesson-title",
            },
            {
              lesson_slug: "specialist-lesson-slug",
              lesson_title: "specialist-lesson-title",
            },
          ],
        }),
      ),
    })({
      lessonSlug: "lesson-slug",
      unitSlug: "unit-slug",
      programmeSlug: "programme-slug",
    });
    expect(lesson.programmeSlug).toEqual("specialist-programme-slug-0");
  });

  test("throws a Zod error if the response is invalid", async () => {
    await expect(async () => {
      await specialistLessonOverview({
        ...sdk,
        specialistLessonOverview: jest.fn(() =>
          Promise.resolve({
            lesson: [
              {
                synthetic_programme_slug: "specialist-programme-slug-0",
                combined_programme_fields: {
                  phase_slug: "specialist-phase-slug",
                  phase_description: "specialist-phase-description",
                  developmentstage_slug: "specialist-development-stage-slug",
                  developmentstage: "specialist-development-stage",
                  subject: "Specialist subject",
                },
                unit_slug: "specialist-unit-slug",
                unit_title: "specialist-unit-title",
                subject_title: "specialist-subject-title",
                key_stage_slug: "specialist-key-stage-slug",
                key_stage_title: "specialist-key-stage-title",
                lesson_slug: "specialist-lesson-slug",
                lesson_title: "specialist-lesson-title",
                additional_material_url: "specialist-supplementary-assets-url",
                supervision_level: "specialist-supervision-level",
                presentation_url: "specialist-presentation-url",
                worksheet_url: "specialist-worksheet-url",
                video_with_sign_language: "specialist-video-with-sign-language",
                transcript_sentences: null,
                video_mux_playback_id: "specialist-video-mux-playback-id",
                video_with_sign_language_mux_playback_id:
                  "specialist-video-with-sign-language-mux-playback-id",
                has_downloadable_resources: false,
                expired: false,
                pupil_lesson_outcome: "specialist-pupil-lesson-outcome",
                key_learning_points: null,
                contains_copyright_content: false,
                misconceptions_and_common_mistakes: null,
                teacher_tips: null,
                content_guidance: null,
                threads: null,
                video_title: null,
                order_in_unit: null,
              },
            ],
            allLessons: [],
          }),
        ),
      })({
        lessonSlug: "lesson-slug",
        unitSlug: "unit-slug",
        programmeSlug: "programme-slug",
      });
    }).rejects.toThrow(`subject_slug`);
  });
});
