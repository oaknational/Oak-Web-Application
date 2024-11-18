import Box from "@/components/SharedComponents/Box";
import MaxWidth from "@/components/SharedComponents/MaxWidth";
import Breadcrumbs from "@/components/SharedComponents/Breadcrumbs";
import {
  getLessonOverviewBreadCrumb,
  getBreadcrumbsForLessonPathway,
  getCommonPathway,
  getBreadcrumbsForSpecialistLessonPathway,
  getLessonMediaBreadCrumb,
  getBreadCrumbForSpecialistMedia,
} from "@/components/TeacherComponents/helpers/lessonHelpers/lesson.helpers";
import {
  LessonPathway,
  SpecialistLessonPathway,
  lessonIsSpecialist,
} from "@/components/TeacherComponents/types/lesson.types";
import { LEGACY_COHORT } from "@/config/cohort";
import { SpecialistLessonDownloads } from "@/node-lib/curriculum-api-2023/queries/specialistLessonDownload/specialistLessonDownload.schema";

type BaseLessonMedia = {
  lessonTitle: string;
  lessonSlug: string;
  lessonCohort?: string | null;
  isSpecialist: false;
  developmentStageTitle?: string | null;
};

type CanonicalLesson = BaseLessonMedia & {
  pathways: LessonPathway[];
  updatedAt: string;
};

type NonCanonicalLesson = BaseLessonMedia & {
  updatedAt: string;
} & LessonPathway;

type SpecialistLesson = SpecialistLessonDownloads["lesson"];

type LessonMediaProps =
  | {
      isCanonical: true;
      lesson: CanonicalLesson;
    }
  | {
      isCanonical: false;
      lesson: NonCanonicalLesson;
    }
  | {
      isCanonical: false;
      lesson: SpecialistLesson;
    };

export function LessonMedia(props: LessonMediaProps) {
  const { isCanonical, lesson } = props;
  const { lessonTitle, lessonSlug, isSpecialist } = lesson;

  const commonPathway =
    lessonIsSpecialist(lesson) && !props.isCanonical
      ? {
          lessonSlug,
          lessonTitle,
          unitSlug: props.lesson.unitSlug,
          programmeSlug: props.lesson.programmeSlug,
          unitTitle: props.lesson.unitTitle,
          subjectTitle: props.lesson.subjectTitle,
          subjectSlug: props.lesson.subjectSlug,
          developmentStageTitle: props.lesson.developmentStageTitle,
          disabled: false,
          lessonCohort: LEGACY_COHORT,
          keyStageSlug: null,
          keyStageTitle: null,
        }
      : getCommonPathway(
          props.isCanonical ? props.lesson.pathways : [props.lesson],
        );

  const { programmeSlug, unitSlug } = commonPathway;

  return (
    <Box $ph={[16, null]} $background={"grey20"}>
      <MaxWidth $pb={80} $maxWidth={[480, 840, 1280]}>
        <Box $mb={32} $mt={24}>
          <Breadcrumbs
            breadcrumbs={
              !isSpecialist
                ? [
                    ...getBreadcrumbsForLessonPathway(commonPathway),
                    getLessonOverviewBreadCrumb({
                      lessonTitle,
                      lessonSlug,
                      programmeSlug,
                      unitSlug,
                      isCanonical,
                    }),
                    getLessonMediaBreadCrumb({
                      lessonSlug,
                      programmeSlug,
                      unitSlug,
                      disabled: true,
                    }),
                  ]
                : [
                    ...getBreadcrumbsForSpecialistLessonPathway(
                      commonPathway as SpecialistLessonPathway,
                    ),
                    ...getBreadCrumbForSpecialistMedia({
                      lessonSlug,
                      programmeSlug,
                      unitSlug,
                      disabled: true,
                    }),
                  ]
            }
          />
        </Box>
      </MaxWidth>
    </Box>
  );
}
