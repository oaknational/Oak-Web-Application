import {
  KeyStage,
  LessonSearchHit,
  UnitSearchHit,
  SearchHit,
} from "./search.types";

import errorReporter from "@/common-lib/error-reporter";
import { LessonListItemProps } from "@/components/UnitAndLessonLists/LessonList/LessonListItem";
import { UnitListItemProps } from "@/components/UnitAndLessonLists/UnitList/UnitListItem/UnitListItem";
import OakError from "@/errors/OakError";
import truthy from "@/utils/truthy";

const reportError = errorReporter("search/helpers");

export const isFilterItem = <T extends { slug: string }>(
  slug: string,
  allFilterItems: T[],
) => {
  return allFilterItems.some((item) => item.slug === slug);
};

export const getFilterForQuery = <T extends { slug: string }>(
  queryFilterItems: string | string[],
  allFilterItems: T[],
) => {
  const queryFilterArray = queryFilterItems.toString().split(",");
  return queryFilterArray.filter((querySlug) =>
    isFilterItem(querySlug, allFilterItems),
  );
};

// Analytics
export const getSortedSearchFiltersSelected = (
  filterOptions: string | string[] | undefined,
): [] | string[] => {
  if (typeof filterOptions === "string") {
    return filterOptions.split(",").sort((a, b) => (a < b ? -1 : 1));
  } else if (Array.isArray(filterOptions)) {
    return filterOptions.sort((a, b) => (a.slice(-1) < b.slice(-1) ? -1 : 1));
  }
  return [];
};

export function elasticKeyStageSlugToKeyStage({
  elasticKeyStageSlug,
  allKeyStages,
}: {
  elasticKeyStageSlug: string;
  allKeyStages: KeyStage[];
}) {
  function lastChar(str: string) {
    return str.charAt(str.length - 1);
  }
  const keyStage = allKeyStages.find(
    (keyStage) => lastChar(keyStage.slug) === lastChar(elasticKeyStageSlug),
  );

  if (!keyStage) {
    const error = new OakError({
      code: "search/unknown",
      meta: {
        elasticKeyStageSlug,
        allKeyStages,
        impact: "Key stage not found from elastic key stage slug",
      },
    });

    reportError(error);
  }

  return keyStage;
}

const getProgrammeSlug = (
  hit: LessonSearchHit | UnitSearchHit,
  allKeyStages: KeyStage[],
) => {
  if (hit._source.programme_slug) {
    return hit._source.programme_slug;
  }

  return [
    hit._source.subject_slug,
    hit._source.phase,
    elasticKeyStageSlugToKeyStage({
      elasticKeyStageSlug: hit._source.key_stage_slug,
      allKeyStages,
    })?.slug,
    hit._source.tier?.toLowerCase(),
  ]
    .filter(truthy)
    .join("-");
};

export function getLessonObject(props: {
  hit: LessonSearchHit;
  allKeyStages: KeyStage[];
}): Omit<
  LessonListItemProps,
  "hideTopHeading" | "trackSearchListItemSelected" | "index" | "hitCount"
> | null {
  const { hit, allKeyStages } = props;
  const { _source, highlight } = hit;
  const highlightedHit = { ..._source, ...highlight };
  const keyStage = elasticKeyStageSlugToKeyStage({
    elasticKeyStageSlug: highlightedHit.key_stage_slug.toString(),
    allKeyStages,
  });
  const lessonResult = {
    programmeSlug: getProgrammeSlug(hit, allKeyStages),
    lessonTitle: highlightedHit.title?.toString(),
    lessonSlug: highlightedHit.slug?.toString(),
    description: highlightedHit.lesson_description?.toString() || "",
    subjectSlug: highlightedHit.subject_slug?.toString(),
    keyStageSlug: keyStage?.slug?.toString() || "",
    keyStageTitle: keyStage?.title?.toString() || "",
    subjectTitle: highlightedHit.subject_title?.toString(),
    unitSlug:
      highlightedHit.unit_slug?.toString() ||
      highlightedHit.topic_slug?.toString() ||
      "",
    unitTitle: highlightedHit.topic_title?.toString() || "",
    videoCount: null,
    presentationCount: null,
    worksheetCount: null,
    hasCopyrightMaterial: false, // this will need to be added to elastic search
    quizCount: null,
    expired: Boolean(highlightedHit.expired),
  };

  const { unitSlug, programmeSlug, lessonSlug, keyStageSlug, subjectSlug } =
    lessonResult;

  if (
    !unitSlug ||
    !programmeSlug ||
    !lessonSlug ||
    !keyStageSlug ||
    !subjectSlug
  ) {
    console.warn(`Search result was omitted due to empty slug`, lessonResult);

    return null;
  }

  return lessonResult;
}

export function getUnitObject(props: {
  hit: UnitSearchHit;
  allKeyStages: KeyStage[];
}): Omit<
  UnitListItemProps,
  "hideTopHeading" | "index" | "hitCount" | "expiredLessonCount"
> | null {
  const { hit, allKeyStages } = props;
  const { _source, highlight } = hit;
  const highlightedHit = { ..._source, ...highlight };
  const keyStage = elasticKeyStageSlugToKeyStage({
    elasticKeyStageSlug: highlightedHit.key_stage_slug.toString(),
    allKeyStages,
  });

  const unitResult = {
    programmeSlug: getProgrammeSlug(hit, allKeyStages),
    title: highlightedHit.title?.toString(),
    nullTitle: highlightedHit.title?.toString(),
    slug: highlightedHit.slug?.toString(),
    themeTitle: highlightedHit.theme_title?.toString() || null,
    themeSlug: null, // null values need to be added to elastic search
    lessonCount: null,
    quizCount: null,
    yearTitle: null,
    subjectSlug: highlightedHit.subject_slug?.toString(),
    subjectTitle: highlightedHit.subject_title?.toString(),
    keyStageSlug: keyStage?.slug?.toString() || "",
    keyStageTitle: keyStage?.title?.toString() || "",
    expired: Boolean(highlightedHit.expired),
    learningThemes: [{ themeSlug: null, themeTitle: null }],
  };

  const { slug, programmeSlug, keyStageSlug, subjectSlug } = unitResult;

  if (!slug || !programmeSlug || !keyStageSlug || !subjectSlug) {
    console.warn(`Search result was omitted due to empty slug:`, unitResult);

    return null;
  }

  return unitResult;
}

export function isLessonSearchHit(x: SearchHit): x is LessonSearchHit {
  return x._source.type === "lesson";
}
