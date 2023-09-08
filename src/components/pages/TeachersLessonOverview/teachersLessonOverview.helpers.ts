import { LessonBase, LessonPathway } from "./teachersLessonOverview.types";

import truthy from "@/utils/truthy";
import { Breadcrumb } from "@/components/Breadcrumbs";

type NullableValues<T> = {
  [K in keyof T]: T[K] | null;
};

/**
 * Returns the intersection different pathways.
 * Where a property is different, the value is set to null.
 */
export const getCommonPathway = (
  pathways: LessonPathway[],
): NullableValues<LessonPathway> => {
  const nullPathway: NullableValues<LessonPathway> = {
    keyStageSlug: null,
    keyStageTitle: null,
    programmeSlug: null,
    subjectTitle: null,
    unitSlug: null,
    unitTitle: null,
    subjectSlug: null,
  };

  const commonPathway = Object.entries(nullPathway).reduce((acc, curr) => {
    const [key, value] = curr as [keyof LessonPathway, string | null];
    acc[key] = acc[key] === value ? value : null;

    return acc;
  }, pathways[0] || nullPathway);

  return commonPathway;
};

export const getBreadcrumbsForLessonPathway = (
  lesson: NullableValues<LessonPathway>,
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
        viewType: "teachers",
      },
      label: "Home",
    },
    keyStageSlug && keyStageTitle
      ? {
          oakLinkProps: {
            page: "subject-index",
            viewType: "teachers",
            keyStageSlug,
          },
          label: keyStageTitle,
        }
      : null,
    subjectTitle && programmeSlug
      ? {
          oakLinkProps: {
            page: "unit-index",
            viewType: "teachers",
            programmeSlug,
          },
          label: subjectTitle,
        }
      : null,
    unitTitle && programmeSlug && unitSlug
      ? {
          oakLinkProps: {
            page: "lesson-index",
            viewType: "teachers",
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
