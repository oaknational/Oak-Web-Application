import {
  LessonBase,
  LessonPathway,
} from "@/components/TeacherComponents/types/lesson.types";
import truthy from "@/utils/truthy";
import { Breadcrumb } from "@/components/SharedComponents/Breadcrumbs";
import { ShallowNullable } from "@/utils/util.types";
import {
  LessonOverviewQuizData,
  StemImageObject,
} from "@/node-lib/curriculum-api-2023/shared.schema";
import type { MediaClip } from "@/node-lib/curriculum-api-2023/queries/lessonMediaClips/lessonMediaClips.schema";
import { LessonItemTitle } from "@/components/TeacherComponents/LessonItemContainer";
import { resolveOakHref } from "@/common-lib/urls";
import {
  getTeacherSubjectPhaseSlug,
  parseProgrammeSlug,
} from "@/utils/curriculum/slugs";

/**
 * Returns the intersection different pathways.
 * Where a property is different, the value is set to null.
 */
export const getCommonPathway = (
  pathways: LessonPathway[],
): ShallowNullable<LessonPathway> => {
  const nullPathway: ShallowNullable<LessonPathway> = {
    keyStageSlug: null,
    keyStageTitle: null,
    programmeSlug: null,
    subjectTitle: null,
    unitSlug: null,
    unitTitle: null,
    year: null,
    yearTitle: null,
    subjectSlug: null,
    examBoardSlug: null,
    examBoardTitle: null,
    tierSlug: null,
    tierTitle: null,
    lessonCohort: null,
    subjectParent: null,
    pathwayTitle: null,
  };
  return pathways.reduce(
    (acc, pathway) => {
      Object.keys(acc).forEach((_key) => {
        const key = _key as keyof LessonPathway;
        if (acc[key] === null || acc[key] === pathway[key]) {
          acc[key] = pathway[key] || null;
        } else {
          acc[key] = null;
        }
      });
      return acc;
    },
    { ...nullPathway },
  );
};

export const getLessonOverviewBreadCrumb = ({
  lessonSlug,
  lessonTitle,
  programmeSlug,
  unitSlug,
  disabled,
  isCanonical,
}: {
  lessonSlug: string;
  lessonTitle: string;
  programmeSlug: string | null;
  unitSlug: string | null;
  disabled?: boolean;
  isCanonical: boolean;
}): Breadcrumb => {
  if (programmeSlug && unitSlug && !isCanonical) {
    return {
      href: resolveOakHref({
        page: "lesson-overview",
        programmeSlug,
        unitSlug,
        lessonSlug,
      }),
      label: lessonTitle,
      disabled,
    };
  } else {
    return {
      href: resolveOakHref({
        page: "lesson-overview-canonical",
        lessonSlug,
      }),
      label: lessonTitle,
      disabled,
    };
  }
};

export const getLessonDownloadsBreadCrumb = ({
  lessonSlug,
  programmeSlug,
  unitSlug,
  disabled,
}: {
  lessonSlug: string;
  programmeSlug: string | null;
  unitSlug: string | null;
  disabled?: boolean;
}): Breadcrumb => {
  if (programmeSlug && unitSlug) {
    return {
      href: resolveOakHref({
        page: "lesson-downloads",
        programmeSlug,
        unitSlug,
        lessonSlug,
      }),
      label: "Downloads",
      disabled,
    };
  } else {
    return {
      href: resolveOakHref({
        page: "lesson-downloads-canonical",
        lessonSlug,
        downloads: "downloads",
      }),
      label: "Downloads",
      disabled,
    };
  }
};
export const getLessonMediaBreadCrumb = ({
  lessonSlug,
  programmeSlug,
  unitSlug,
  subjectSlug,
  disabled,
}: {
  lessonSlug: string;
  programmeSlug: string | null;
  unitSlug: string | null;
  subjectSlug: string;
  disabled?: boolean;
}): Breadcrumb => {
  const mediaClipLabel = getMediaClipLabel(subjectSlug);
  if (programmeSlug && unitSlug) {
    return {
      href: resolveOakHref({
        page: "lesson-media",
        programmeSlug,
        unitSlug,
        lessonSlug,
      }),
      label: mediaClipLabel,
      disabled,
    };
  } else {
    return {
      href: resolveOakHref({
        page: "lesson-media-canonical",
        lessonSlug,
      }),
      label: mediaClipLabel,
      disabled,
    };
  }
};
export const getLessonShareBreadCrumb = ({
  lessonSlug,
  programmeSlug,
  unitSlug,
  disabled,
}: {
  lessonSlug: string;
  programmeSlug: string;
  unitSlug: string;
  disabled?: boolean;
}): Breadcrumb => {
  return {
    href: resolveOakHref({
      page: "lesson-share",
      programmeSlug,
      unitSlug,
      lessonSlug,
    }),
    label: "Share",
    disabled,
  };
};

export const getBreadcrumbsForLessonPathway = (
  lesson: ShallowNullable<LessonPathway>,
): Breadcrumb[] => {
  const {
    keyStageSlug,
    keyStageTitle,
    programmeSlug,
    subjectTitle,
    unitSlug,
    unitTitle,
  } = lesson;
  const parsed = parseProgrammeSlug(programmeSlug ?? "");

  const subjectPhaseSlug = parsed
    ? getTeacherSubjectPhaseSlug({
        subjectSlug: parsed.subjectSlug,
        phaseSlug: parsed.phaseSlug,
        examboardSlug: parsed.examboardSlug,
        pathwaySlug: parsed.pathwaySlug,
      })
    : null;

  const nullableBreadcrumbs: (Breadcrumb | null)[] = [
    {
      href: resolveOakHref({
        page: "home",
      }),
      label: "Home",
    },
    keyStageSlug && keyStageTitle
      ? {
          href: resolveOakHref({
            page: "home",
          }),
          label: keyStageTitle,
        }
      : null,
    subjectTitle && programmeSlug && subjectPhaseSlug
      ? {
          href: resolveOakHref({
            page: "teacher-programme",
            subjectPhaseSlug: subjectPhaseSlug,
            tab: "units",
            query: {
              keystages: parsed?.keystageSlug ?? undefined,
              years: parsed?.yearSlug?.replace(/^year-/, ""),
              tiers: parsed?.tierSlug ?? undefined,
            },
          }),
          label: subjectTitle,
        }
      : null,
    unitTitle && programmeSlug && unitSlug
      ? {
          href: resolveOakHref({
            page: "unit-overview",
            programmeSlug,
            unitSlug,
          }),
          label: unitTitle,
        }
      : null,
  ];

  return nullableBreadcrumbs.filter(truthy);
};

export type GetPageLinksForLessonProps = Pick<
  LessonBase,
  | "lessonGuideUrl"
  | "presentationUrl"
  | "videoMuxPlaybackId"
  | "worksheetUrl"
  | "additionalMaterialUrl"
  | "starterQuiz"
  | "exitQuiz"
  | "hasLegacyCopyrightMaterial"
  | "hasMediaClips"
>;

/**
 * Identifies the type of lesson resource.
 * Used for business logic, downloads, and tracking.
 */
export type LessonResourceType =
  | "lesson-guide"
  | "slide-deck"
  | "lesson-details"
  | "video"
  | "worksheet"
  | "starter-quiz"
  | "exit-quiz"
  | "additional-material"
  | "media-clips";

/**
 * Anchor IDs for navigation within the lesson page.
 * Includes LessonResourceType plus the special "quiz" anchor
 * which is used when both quizzes are grouped together.
 */
export type LessonPageLinkAnchorId = LessonResourceType | "quiz";

type Attribution = {
  questionNumber: string;
  attribution: string;
};

export const createAttributionObject = (
  questions: LessonOverviewQuizData,
): Attribution[] | [] => {
  if (questions) {
    const attributions: Attribution[] = questions.reduce(
      (acc: Attribution[], question, index) => {
        const questionNumber = `Q${index + 1}`;
        if (question?.questionStem) {
          const { questionStem } = question;
          const imageStems = questionStem.filter(
            (stem) =>
              stem.type === "image" &&
              !Array.isArray(stem.imageObject.metadata) &&
              stem.imageObject.metadata.attribution &&
              stem.imageObject,
          ) as StemImageObject[];
          const mappedAttributions: Attribution[] = imageStems.map((stem) => {
            if (
              !Array.isArray(stem.imageObject.metadata) &&
              stem.imageObject.metadata.attribution
            ) {
              return {
                questionNumber,
                attribution: stem.imageObject.metadata.attribution,
              };
            }
          }) as Attribution[];
          acc.push(...mappedAttributions);
        }
        if (question?.answers) {
          const { answers } = question;
          if (answers["multiple-choice"]) {
            const { "multiple-choice": multipleChoice } = answers;
            multipleChoice.forEach(({ answer }, index) => {
              answer.forEach((stem) => {
                if (
                  stem.type === "image" &&
                  !Array.isArray(stem.imageObject.metadata) &&
                  stem.imageObject.metadata?.attribution
                ) {
                  acc.push({
                    questionNumber: `${questionNumber} image ${index + 1}`,
                    attribution: stem.imageObject.metadata.attribution,
                  });
                }
              });
            });
          }
        }

        return acc;
      },
      [],
    );
    return attributions;
  }
  return [];
};

export const getMediaClipLabel = (subjectSlug: string): LessonItemTitle => {
  switch (subjectSlug) {
    case "physical-education":
      return "Demonstration videos";
    case "spanish":
    case "french":
    case "german":
      return "Audio clips";
    default:
      return "Video & audio clips";
  }
};

export const sortMediaClipsByOrder = (a: MediaClip, b: MediaClip) => {
  if (Number(a.order) < Number(b.order)) {
    return -1;
  } else if (Number(a.order) > Number(b.order)) {
    return 1;
  }
  return 0;
};
