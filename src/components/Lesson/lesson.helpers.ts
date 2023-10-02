import { pick, groupBy } from "lodash";

import { LessonBase, LessonPathway } from "./lesson.types";

import truthy from "@/utils/truthy";
import { Breadcrumb } from "@/components/Breadcrumbs";
import { ShallowNullable } from "@/utils/util.types";

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
}: {
  lessonSlug: string;
  lessonTitle: string;
  programmeSlug: string | null;
  unitSlug: string | null;
  disabled?: boolean;
}): Breadcrumb => {
  if (programmeSlug && unitSlug) {
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
      },
      label: "Downloads",
      disabled,
    };
  } else {
    return {
      oakLinkProps: {
        page: "lesson-downloads-canonical",
        lessonSlug,
      },
      label: "Downloads",
      disabled,
    };
  }
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
    subjectTitle && programmeSlug
      ? {
          oakLinkProps: {
            page: "unit-index",
            programmeSlug,
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
  | "presentationUrl"
  | "videoMuxPlaybackId"
  | "worksheetUrl"
  | "additionalMaterialUrl"
  | "starterQuiz"
  | "exitQuiz"
  | "hasCopyrightMaterial"
>;
export type LessonPageLinkAnchorId =
  | "slide-deck"
  | "lesson-details"
  | "video"
  | "worksheet"
  | "starter-quiz"
  | "exit-quiz"
  | "additional-material";
export const getPageLinksForLesson = (
  lesson: GetPageLinksForLessonProps,
): {
  label: string;
  anchorId: LessonPageLinkAnchorId;
  href: `#${LessonPageLinkAnchorId}`;
}[] => {
  const PAGE_LINKS: {
    label: string;
    anchorId: LessonPageLinkAnchorId;
    condition: (lesson: GetPageLinksForLessonProps) => boolean;
  }[] = [
    {
      label: "Slide deck",
      anchorId: "slide-deck",
      condition: (lesson) =>
        Boolean(lesson.presentationUrl && !lesson.hasCopyrightMaterial),
    },
    {
      label: "Lesson details",
      anchorId: "lesson-details",
      condition: () => true,
    },
    {
      label: "Video",
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

  return PAGE_LINKS.filter((pageLink) => pageLink.condition(lesson))
    .map((lesson) => pick(lesson, ["label", "anchorId"]))
    .map((pageLink) => ({
      ...pageLink,
      href: `#${pageLink.anchorId}`,
    }));
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
