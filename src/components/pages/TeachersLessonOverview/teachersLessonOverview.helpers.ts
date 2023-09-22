import { pick, groupBy } from "lodash";

import { LessonBase, LessonPathway } from "./teachersLessonOverview.types";

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
    subjectSlug: null,
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

export const getLessonOverviewBreadCumb = ({
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
export const getLessonDownloadsBreadCumb = ({
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
        programmeSlug: null,
        unitSlug: null,
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

const PAGE_LINKS: {
  label: string;
  href: string;
  condition: (lesson: LessonBase) => boolean;
}[] = [
  {
    label: "Slide deck",
    href: "#slideDeck",
    condition: (lesson) =>
      Boolean(lesson.presentationUrl && !lesson.hasCopyrightMaterial),
  },
  {
    label: "Lesson details",
    href: "#lessonDetails",
    condition: () => true,
  },
  {
    label: "Video",
    href: "#video",
    condition: (lesson) => Boolean(lesson.videoMuxPlaybackId),
  },
  {
    label: "Worksheet",
    href: "#worksheet",
    condition: (lesson) => Boolean(lesson.worksheetUrl),
  },
  {
    label: "Additional material",
    href: "#additionalMaterial",
    condition: (lesson) => Boolean(lesson.additionalMaterialUrl),
  },
  {
    label: "Starter quiz",
    href: "#starterQuiz",
    condition: (lesson) =>
      Boolean(lesson.starterQuiz && lesson.starterQuiz.length > 0),
  },
  {
    label: "Exit quiz",
    href: "#exitQuiz",
    condition: (lesson) =>
      Boolean(lesson.exitQuiz && lesson.exitQuiz.length > 0),
  },
];

export const getPageLinksForLesson = (lesson: LessonBase) => {
  return PAGE_LINKS.filter((pageLink) => pageLink.condition(lesson));
};

export function groupLessonPathways(pathways: LessonPathway[]) {
  const pathwaysByUnit = Object.values(groupBy(pathways, "unitSlug"));

  const units = pathwaysByUnit
    .map((unitPathways) => {
      const pathwaysByExamboard = Object.values(
        groupBy(unitPathways, "examboardSlug"),
      );

      const examboards = pathwaysByExamboard
        .map((examboardPathways) => {
          const [firstPathway] = examboardPathways;
          if (!firstPathway) return null;
          return {
            ...pick(firstPathway, [
              "examboardTitle",
              "examboardSlug",
              "subjectTitle",
              "subjectSlug",
            ]),
            tiers: examboardPathways.map((pathway) =>
              pick(pathway, ["programmeSlug", "tierTitle", "tierSlug"]),
            ),
          };
        })
        .filter(truthy);

      const [firstPathway] = unitPathways;
      if (!firstPathway) return null;
      return {
        ...pick(firstPathway, ["unitTitle", "unitSlug"]),
        examboards,
      };
    })
    .filter(truthy);

  return {
    units,
  };
}
