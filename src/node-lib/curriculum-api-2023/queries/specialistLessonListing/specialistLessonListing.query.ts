import { Sdk } from "../../sdk";

import {
  SpecialistLessonListingData,
  specialistLessonQueryResponseSchema,
} from "./specialistLessonListing.schema";

const specialistLessonListingQuery =
  (sdk: Sdk) => async (args: { unitSlug: string; programmeSlug: string }) => {
    const { programmeSlug, unitSlug } = args;
    const { specialistLessonListing } = await sdk.specialistLessonListing({
      unitSlug: unitSlug,
      programmeSlug: programmeSlug,
    });

    const parsedLessonListing = specialistLessonQueryResponseSchema.parse(
      specialistLessonListing,
    );

    if (!parsedLessonListing || parsedLessonListing.length === 0) {
      throw new Error("curriculum-api/not-found");
    }

    const transformedLessonLising: SpecialistLessonListingData =
      parsedLessonListing.reduce(
        (acc, lesson) => {
          const developmentStage =
            lesson.combined_programme_fields.developmentstage;
          if (!acc.programmeTitle) {
            acc.programmeTitle = `${lesson.combined_programme_fields.subject} ${
              developmentStage
                ? `- ${lesson.combined_programme_fields.developmentstage}`
                : ""
            }`;
          }
          if (!acc.subjectSlug) {
            acc.subjectSlug = lesson.combined_programme_fields.subject_slug;
          }
          if (!acc.subjectTitle) {
            acc.subjectTitle = lesson.combined_programme_fields.subject;
          }
          if (!acc.unitTitle) {
            acc.unitTitle = lesson.unit_title;
          }
          if (!acc.lessons) {
            acc.lessons = [];
          }

          const quizCount =
            (lesson.exit_quiz ? 1 : 0) + (lesson.starter_quiz ? 1 : 0);

          const lessonDetails = {
            lessonSlug: lesson.lesson_slug,
            lessonTitle: lesson.lesson_title,
            subjectSlug: lesson.combined_programme_fields.subject_slug,
            subjectTitle: lesson.combined_programme_fields.subject,
            developmentStageSlug:
              lesson.combined_programme_fields.developmentstage_slug ?? null,
            developmentStageTitle:
              lesson.combined_programme_fields.developmentstage ?? "",
            unitSlug: lesson.unit_slug,
            programmeSlug: programmeSlug,
            programmeTitle: acc.programmeTitle,
            description: "", // TODO: description
            expired: lesson.expired ? true : false,
            pupilLessonOutcome: lesson.pupil_lesson_outcome,
            quizCount: quizCount,
            videoCount: lesson.video_mux_playback_id ? 1 : 0,
            presentationCount: lesson.video_mux_playback_id ? 1 : 0,
            worksheetCount: lesson.worksheet_url ? 1 : 0,
            hasCurriculumDownload: false, // TODO: curriculum download
            orderInUnit: lesson.order_in_unit,
            developmentStage: developmentStage || null,
            isUnpublished: false as const,
          };

          acc.lessons.push(lessonDetails);

          return acc;
        },
        { programmeSlug, unitSlug } as SpecialistLessonListingData,
      );

    transformedLessonLising.lessons.sort(
      (a, b) => a.orderInUnit - b.orderInUnit,
    );

    return transformedLessonLising;
  };

export default specialistLessonListingQuery;
