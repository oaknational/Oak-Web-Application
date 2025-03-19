import { pick, groupBy } from "lodash";

import { checkIsResourceCopyrightRestricted } from "../downloadAndShareHelpers/downloadsCopyright";

import {
  LessonBase,
  LessonPathway,
  SpecialistLessonPathway,
} from "@/components/TeacherComponents/types/lesson.types";
import truthy from "@/utils/truthy";
import { Breadcrumb } from "@/components/SharedComponents/Breadcrumbs";
import { ShallowNullable } from "@/utils/util.types";
import {
  CopyrightContent,
  LessonOverviewQuizData,
  StemImageObject,
} from "@/node-lib/curriculum-api-2023/shared.schema";
import removeLegacySlugSuffix from "@/utils/slugModifiers/removeLegacySlugSuffix";
import isSlugEYFS from "@/utils/slugModifiers/isSlugEYFS";
import { LessonItemTitle } from "@/components/TeacherComponents/LessonItemContainer";

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
    yearSlug: null,
    yearTitle: null,
    subjectSlug: null,
    examBoardSlug: null,
    examBoardTitle: null,
    tierSlug: null,
    tierTitle: null,
    lessonCohort: null,
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
      oakLinkProps: {
        page: "lesson-overview",
        programmeSlug,
        unitSlug,
        lessonSlug,
      },
      label: lessonTitle,
      disabled,
    };
  } else {
    return {
      oakLinkProps: {
        page: "lesson-overview-canonical",
        lessonSlug,
      },
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
      oakLinkProps: {
        page: "lesson-downloads",
        programmeSlug,
        unitSlug,
        lessonSlug,
        downloads: "downloads",
      },
      label: "Downloads",
      disabled,
    };
  } else {
    return {
      oakLinkProps: {
        page: "lesson-downloads-canonical",
        lessonSlug,
        downloads: "downloads",
      },
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
      oakLinkProps: {
        page: "lesson-media",
        programmeSlug,
        unitSlug,
        lessonSlug,
      },
      label: mediaClipLabel,
      disabled,
    };
  } else {
    return {
      oakLinkProps: {
        page: "lesson-media-canonical",
        lessonSlug,
      },
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
  programmeSlug: string | null;
  unitSlug: string | null;
  disabled?: boolean;
}): Breadcrumb => {
  if (programmeSlug && unitSlug) {
    return {
      oakLinkProps: {
        page: "lesson-share",
        programmeSlug,
        unitSlug,
        lessonSlug,
      },
      label: "Share",
      disabled,
    };
  } else {
    return {
      oakLinkProps: {
        page: "lesson-share-canonical",
        lessonSlug,
      },
      label: "Share",
      disabled,
    };
  }
};

export const getBreadCrumbForSpecialistDownload = ({
  lessonSlug,
  programmeSlug,
  unitSlug,
  disabled,
}: {
  lessonSlug: string;
  programmeSlug: string | null;
  unitSlug: string | null;
  disabled?: boolean;
}): Breadcrumb[] => {
  const nullableBreadcrumbs: (Breadcrumb | null)[] = [
    programmeSlug && unitSlug
      ? {
          oakLinkProps: {
            page: "specialist-lesson-downloads",
            programmeSlug,
            unitSlug,
            lessonSlug,
            downloads: "downloads",
          },
          label: "Downloads",
          disabled,
        }
      : null,
  ];
  return nullableBreadcrumbs.filter(truthy);
};

export const getBreadCrumbForSpecialistShare = ({
  lessonSlug,
  programmeSlug,
  unitSlug,
  disabled,
}: {
  lessonSlug: string;
  programmeSlug: string | null;
  unitSlug: string | null;
  disabled?: boolean;
}): Breadcrumb[] => {
  const nullableBreadcrumbs: (Breadcrumb | null)[] = [
    programmeSlug && unitSlug
      ? {
          oakLinkProps: {
            page: "specialist-lesson-share",
            programmeSlug,
            unitSlug,
            lessonSlug,
          },
          label: "Share",
          disabled,
        }
      : null,
  ];
  return nullableBreadcrumbs.filter(truthy);
};

export const getBreadcrumbsForSpecialistLessonPathway = (
  lesson: SpecialistLessonPathway | null,
): Breadcrumb[] | [] => {
  if (!lesson) return [];
  const {
    programmeSlug,
    subjectTitle,
    subjectSlug,
    developmentStageTitle,
    unitSlug,
    unitTitle,
    disabled,
    lessonSlug,
    lessonTitle,
  } = lesson;
  const nullableBreadcrumbs: (Breadcrumb | null)[] = [
    {
      oakLinkProps: {
        page: "home",
      },
      label: "Home",
    },
    {
      oakLinkProps: {
        page: "specialist-subject-index",
      },
      label: "Specialist and therapies",
    },
    subjectSlug && subjectTitle && programmeSlug
      ? {
          oakLinkProps: {
            page: "specialist-unit-index",
            programmeSlug: programmeSlug,
          },
          label:
            developmentStageTitle !== ""
              ? `${subjectTitle} - ${developmentStageTitle}`
              : `${subjectTitle}`,
        }
      : null,
    programmeSlug && unitSlug && unitTitle
      ? {
          oakLinkProps: {
            page: "specialist-lesson-index",
            programmeSlug,
            unitSlug,
          },
          label: unitTitle,
        }
      : null,
    programmeSlug && unitSlug && lessonSlug
      ? {
          oakLinkProps: {
            page: "specialist-lesson-overview",
            programmeSlug,
            unitSlug,
            lessonSlug,
          },
          label: lessonTitle,
          disabled,
        }
      : null,
  ];
  return nullableBreadcrumbs.filter(truthy);
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

  let programmeSlugForMathsUnits = programmeSlug;

  if (subjectTitle === "Maths") {
    if (programmeSlug && !isSlugEYFS(programmeSlug)) {
      programmeSlugForMathsUnits = removeLegacySlugSuffix(programmeSlug);
    }
  }

  const nullableBreadcrumbs: (Breadcrumb | null)[] = [
    {
      oakLinkProps: {
        page: "home",
      },
      label: "Home",
    },
    keyStageSlug && keyStageTitle
      ? {
          oakLinkProps: {
            page: "subject-index",
            keyStageSlug,
          },
          label: keyStageTitle,
        }
      : null,
    subjectTitle && programmeSlug && programmeSlugForMathsUnits
      ? {
          oakLinkProps: {
            page: "unit-index",
            programmeSlug: programmeSlugForMathsUnits,
          },
          label: subjectTitle,
        }
      : null,
    unitTitle && programmeSlug && unitSlug
      ? {
          oakLinkProps: {
            page: "lesson-index",
            programmeSlug,
            unitSlug,
          },
          label: unitTitle,
        }
      : null,
  ];

  return nullableBreadcrumbs.filter(truthy);
};

type GetPageLinksForLessonProps = Pick<
  LessonBase,
  | "lessonGuideUrl"
  | "presentationUrl"
  | "videoMuxPlaybackId"
  | "worksheetUrl"
  | "additionalMaterialUrl"
  | "starterQuiz"
  | "exitQuiz"
  | "hasCopyrightMaterial"
  | "hasMediaClips"
>;

export type LessonPageLinkAnchorId =
  | "lesson-guide"
  | "slide-deck"
  | "lesson-details"
  | "video"
  | "worksheet"
  | "starter-quiz"
  | "exit-quiz"
  | "additional-material"
  | "media-clips";

export const getPageLinksForLesson = (
  lesson: GetPageLinksForLessonProps,
  copyrightContent: CopyrightContent,
  mediaClipsLabel?: string,
): {
  label: string;
  anchorId: LessonPageLinkAnchorId;
}[] => {
  const PAGE_LINKS: {
    label: string;
    anchorId: LessonPageLinkAnchorId;
    condition: (lesson: GetPageLinksForLessonProps) => boolean;
  }[] = [
    {
      label: "Lesson guide",
      anchorId: "lesson-guide",
      condition: (lesson) => Boolean(lesson.lessonGuideUrl),
    },
    {
      label: "Slide deck",
      anchorId: "slide-deck",
      condition: (lesson) =>
        Boolean(
          lesson.presentationUrl &&
            !checkIsResourceCopyrightRestricted(
              "presentation",
              copyrightContent,
            ),
        ),
    },
    {
      label: mediaClipsLabel || "Video & audio",
      anchorId: "media-clips",
      condition: (lesson) => lesson.hasMediaClips,
    },
    {
      label: "Lesson details",
      anchorId: "lesson-details",
      condition: () => true,
    },
    {
      label: "Lesson video",
      anchorId: "video",
      condition: (lesson) => Boolean(lesson.videoMuxPlaybackId),
    },
    {
      label: "Worksheet",
      anchorId: "worksheet",
      condition: (lesson) => Boolean(lesson.worksheetUrl),
    },
    {
      label: "Starter quiz",
      anchorId: "starter-quiz",
      condition: (lesson) =>
        Boolean(lesson.starterQuiz && lesson.starterQuiz.length > 0),
    },
    {
      label: "Exit quiz",
      anchorId: "exit-quiz",
      condition: (lesson) =>
        Boolean(lesson.exitQuiz && lesson.exitQuiz.length > 0),
    },
    {
      label: "Additional material",
      anchorId: "additional-material",
      condition: (lesson) => Boolean(lesson.additionalMaterialUrl),
    },
  ];

  return PAGE_LINKS.filter((pageLink) => pageLink.condition(lesson)).map(
    (lesson) => pick(lesson, ["label", "anchorId"]),
  );
};

export function groupLessonPathways(pathways: LessonPathway[]) {
  const pathwaysBySubject = Object.values(groupBy(pathways, "subjectSlug"));

  const subjects = pathwaysBySubject
    .map((subjectPathways) => {
      const pathwaysByUnit = Object.values(
        groupBy(subjectPathways, "unitSlug"),
      );

      const units = pathwaysByUnit
        .map((unitPathways) => {
          const pathwaysByExamboard = Object.values(
            groupBy(unitPathways, "examBoardSlug"),
          );

          const examBoards = pathwaysByExamboard
            .map((examBoardPathways) => {
              const [firstPathway] = examBoardPathways;
              if (!firstPathway) return null;
              return {
                ...pick(firstPathway, [
                  "examBoardTitle",
                  "examBoardSlug",
                  "subjectTitle",
                  "subjectSlug",
                ]),
                tiers: examBoardPathways.map((pathway) =>
                  pick(pathway, ["programmeSlug", "tierTitle", "tierSlug"]),
                ),
              };
            })
            .filter(truthy);

          const [firstPathway] = unitPathways;
          if (!firstPathway) return null;
          return {
            ...pick(firstPathway, ["unitTitle", "unitSlug"]),
            examBoards,
          };
        })
        .filter(truthy);

      const [firstPathway] = subjectPathways;
      if (!firstPathway) return null;
      return {
        ...pick(firstPathway, ["subjectTitle", "subjectSlug"]),
        units,
      };
    })
    .filter(truthy);

  return {
    subjects,
  };
}

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
        if (question && question.questionStem) {
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
        if (question && question.answers) {
          const { answers } = question;
          if (answers["multiple-choice"]) {
            const { "multiple-choice": multipleChoice } = answers;
            multipleChoice.forEach(({ answer }, index) => {
              answer.forEach((stem) => {
                if (
                  stem.type === "image" &&
                  !Array.isArray(stem.imageObject.metadata) &&
                  stem.imageObject.metadata &&
                  stem.imageObject.metadata.attribution
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

export const convertBytesToMegabytes = (bytes: number): string => {
  const bytesInOneMegabyte = 1024 * 1024;
  const megabytes = bytes / bytesInOneMegabyte;
  return megabytes.toFixed(1);
};
