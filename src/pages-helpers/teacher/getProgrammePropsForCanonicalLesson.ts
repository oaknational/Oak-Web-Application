import {
  phaseDescriptions,
  phaseSlugs,
  yearDescriptions,
  years,
  pathwayDescriptions,
  pathwaySlugs,
  examboardSlugs,
  examboards,
  keystageSlugs,
  keystageDescriptions,
  subjectSlugs,
  tierSlugs,
  tierDescriptions,
} from "@oaknational/oak-curriculum-schema";

import { CanonicalLessonMediaClips } from "@/node-lib/curriculum-api-2023/queries/lessonMediaClips/lessonMediaClips.schema";
import { LessonOverviewPageData } from "@/node-lib/curriculum-api-2023/queries/lessonOverview/lessonOverview.schema";

export const getProgrammePropsForCanonicalLesson = (
  lesson: LessonOverviewPageData | CanonicalLessonMediaClips,
) => {
  const firstPathway = lesson.pathways[0];

  const programmeSlug = firstPathway?.programmeSlug ?? "";
  const subjectSlug =
    subjectSlugs.safeParse(firstPathway?.subjectSlug).data ??
    (lesson as LessonOverviewPageData).subjectSlug;
  const subjectTitle = firstPathway?.subjectTitle ?? "";
  const phaseTitle =
    phaseDescriptions.safeParse(firstPathway?.phaseTitle).data ?? "Primary";
  const phaseSlug =
    phaseSlugs.safeParse(phaseTitle.toLocaleLowerCase()).data ?? "primary";
  const yearGroupTitle =
    yearDescriptions.safeParse(firstPathway?.yearGroupTitle).data ??
    "All years";
  const year = years.safeParse(firstPathway?.yearGroupSlug).data ?? "All";
  const pathwayTitle =
    pathwayDescriptions.safeParse(firstPathway?.pathwayTitle).data ?? null;
  const pathwaySlug =
    pathwaySlugs.safeParse(pathwayTitle?.toLocaleLowerCase()).data ?? null;
  const examBoardSlug =
    examboardSlugs.safeParse(firstPathway?.examBoardSlug).data ?? null;
  const examBoardTitle =
    examboards.safeParse(firstPathway?.examBoardTitle).data ?? null;
  const keyStageSlug =
    keystageSlugs.safeParse(firstPathway?.keyStageSlug).data ?? "all-ks";
  const keyStageTitle =
    keystageDescriptions.safeParse(firstPathway?.keyStageTitle).data ??
    "All Key Stages";
  const tierSlug = tierSlugs.safeParse(firstPathway?.tierSlug).data ?? null;
  const tierTitle =
    tierDescriptions.safeParse(firstPathway?.tierTitle).data ?? null;
  const unitSlug = firstPathway?.unitSlug ?? "";
  const unitTitle = firstPathway?.unitTitle ?? "";

  return {
    programmeSlug,
    subjectSlug,
    subjectTitle,
    phaseSlug,
    phaseTitle,
    tierSlug,
    tierTitle,
    year,
    yearGroupTitle,
    pathwayTitle,
    pathwaySlug,
    examBoardSlug,
    examBoardTitle,
    keyStageSlug,
    keyStageTitle,
    unitSlug,
    unitTitle,
  };
};
