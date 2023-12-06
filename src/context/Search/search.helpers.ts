import {
  KeyStage,
  LessonSearchHit,
  UnitSearchHit,
  SearchHit,
} from "./search.types";

import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";
import truthy from "@/utils/truthy";
import addLegacySlugSuffix from "@/utils/slugModifiers/addLegacySlugSuffix";
import { SearchResultsItemProps } from "@/components/SearchResultsItem/SearchResultsItem";
import {
  LessonListingLinkProps,
  LessonOverviewLinkProps,
} from "@/common-lib/urls";

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

export const getSearchHitObject = (
  hit: LessonSearchHit | UnitSearchHit,
  allKeyStages: KeyStage[],
) => {
  if (isLessonSearchHit(hit)) {
    return getLessonObject({ hit, allKeyStages });
  }
  if (isUnitSearchHit(hit)) {
    return getUnitObject({ hit, allKeyStages });
  }
};

export function getLessonObject(props: {
  hit: LessonSearchHit;
  allKeyStages: KeyStage[];
}): SearchResultsItemProps | null {
  const { hit, allKeyStages } = props;
  const { _source, highlight, legacy } = hit;
  const highlightedHit = { ..._source, ...highlight };
  const keyStage = elasticKeyStageSlugToKeyStage({
    elasticKeyStageSlug: highlightedHit.key_stage_slug.toString(),
    allKeyStages,
  });
  const buttonLinkProps: LessonOverviewLinkProps = {
    page: "lesson-overview",
    lessonSlug: highlightedHit.slug?.toString(),
    programmeSlug: legacy
      ? addLegacySlugSuffix(getProgrammeSlug(hit, allKeyStages)) ||
        getProgrammeSlug(hit, allKeyStages)
      : getProgrammeSlug(hit, allKeyStages),
    unitSlug:
      highlightedHit.unit_slug?.toString() ||
      highlightedHit.topic_slug?.toString() ||
      "",
  };
  const lessonResult: SearchResultsItemProps = {
    type: "lesson",
    title: highlightedHit.title?.toString(),
    description: highlightedHit.lesson_description?.toString() || "",
    subjectSlug: highlightedHit.subject_slug?.toString(),
    keyStageShortCode: keyStage?.shortCode?.toString() || "",
    keyStageTitle: keyStage?.title?.toString() || "",
    keyStageSlug: keyStage?.slug?.toString() || "",
    subjectTitle: highlightedHit.subject_title?.toString(),
    buttonLinkProps: buttonLinkProps,
    legacy: hit.legacy,
  };

  if (
    !buttonLinkProps.unitSlug ||
    !buttonLinkProps.programmeSlug ||
    !buttonLinkProps.lessonSlug ||
    !lessonResult.subjectSlug
  ) {
    console.warn(`Search result was omitted due to empty slug`, lessonResult);

    return null;
  }

  return lessonResult;
}

export function getUnitObject(props: {
  hit: UnitSearchHit;
  allKeyStages: KeyStage[];
}): SearchResultsItemProps | null {
  const { hit, allKeyStages } = props;
  const { _source, highlight, legacy } = hit;
  const highlightedHit = { ..._source, ...highlight };
  const keyStage = elasticKeyStageSlugToKeyStage({
    elasticKeyStageSlug: highlightedHit.key_stage_slug.toString(),
    allKeyStages,
  });
  const buttonLinkProps: LessonListingLinkProps = {
    page: "lesson-index",
    programmeSlug: legacy
      ? addLegacySlugSuffix(getProgrammeSlug(hit, allKeyStages)) ||
        getProgrammeSlug(hit, allKeyStages)
      : getProgrammeSlug(hit, allKeyStages),
    unitSlug: highlightedHit.slug?.toString(),
  };

  const unitResult: SearchResultsItemProps = {
    type: "unit",
    title: highlightedHit.title?.toString(),
    nullTitle: highlightedHit.title?.toString(),
    subjectSlug: highlightedHit.subject_slug?.toString(),
    subjectTitle: highlightedHit.subject_title?.toString(),
    keyStageShortCode: keyStage?.shortCode?.toString() || "",
    keyStageTitle: keyStage?.title?.toString() || "",
    keyStageSlug: keyStage?.slug?.toString() || "",
    buttonLinkProps: buttonLinkProps,
    legacy: hit.legacy,
  };

  if (
    !buttonLinkProps.unitSlug ||
    !buttonLinkProps.programmeSlug ||
    !unitResult.subjectSlug
  ) {
    console.warn(`Search result was omitted due to empty slug:`, unitResult);

    return null;
  }

  return unitResult;
}

export function isLessonSearchHit(x: SearchHit): x is LessonSearchHit {
  return x._source.type === "lesson";
}

export function isUnitSearchHit(x: SearchHit): x is UnitSearchHit {
  return x._source.type === "unit";
}
