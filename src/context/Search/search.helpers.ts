import { ParsedUrlQuery } from "querystring";

import {
  KeyStage,
  LessonSearchHit,
  UnitSearchHit,
  SearchHit,
  PathwaySchema,
} from "./search.types";

import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";
import truthy from "@/utils/truthy";
import addLegacySlugSuffix from "@/utils/slugModifiers/addLegacySlugSuffix";
import { SearchResultsItemProps } from "@/components/TeacherComponents/SearchResultsItem";
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
export const getFiltersFromQuery = (query: ParsedUrlQuery) => {
  return [
    query.keyStages,
    query.contentTypes,
    query.examBoards,
    query.subjects,
  ];
};

export const combineSearchFilters = (
  filters: Array<string | Array<string> | undefined>,
) => {
  return filters
    .flat()
    .filter((f) => !!f)
    .join(",");
};

export const getSortedSearchFiltersSelected = (
  query: ParsedUrlQuery,
): [] | string[] => {
  const combinedFilters = combineSearchFilters(getFiltersFromQuery(query));
  if (!combinedFilters) {
    return [];
  }
  return combinedFilters.split(",").sort((a, b) => (a < b ? -1 : 1));
};

export const keyStageToSentenceCase = (
  keyStage?: string,
): string | undefined => {
  if (!keyStage) {
    return undefined;
  }
  const words = keyStage.split(" ");

  if (words.length > 1 && words[1] !== undefined) {
    words[1] = words[1].toLowerCase();
  }

  return words.join(" ");
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

  return { ...keyStage, title: keyStageToSentenceCase(keyStage?.title) };
}

const pathwaysSnakeToCamel = (pathway: PathwaySchema) => {
  return {
    programmeSlug: pathway.programme_slug,
    unitSlug: pathway.unit_slug,
    unitTitle: pathway.unit_title,
    keyStageSlug: pathway.key_stage_slug,
    keyStageTitle: pathway.key_stage_title,
    subjectSlug: pathway.subject_slug,
    subjectTitle: pathway.subject_title,
    tierSlug: pathway.tier_slug || null,
    tierTitle: pathway.tier_title || null,
    examBoardSlug: pathway.exam_board_slug || null,
    examBoardTitle: pathway.exam_board_title || null,
    yearSlug: pathway.year_slug || null,
    yearTitle: pathway.year_title || null,
  };
};

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
    unitTitle:
      highlightedHit.unit_title?.toString() ||
      highlightedHit.topic_title?.toString() ||
      "",
    description: highlightedHit.lesson_description?.toString() || "",
    pupilLessonOutcome: highlightedHit.pupil_lesson_outcome?.toString() || "",
    subjectSlug: highlightedHit.subject_slug?.toString(),
    keyStageShortCode: keyStage?.shortCode?.toString() || "",
    keyStageTitle: keyStage?.title?.toString() || "",
    keyStageSlug: keyStage?.slug?.toString() || "",
    subjectTitle: highlightedHit.subject_title?.toString(),
    buttonLinkProps: buttonLinkProps,
    cohort: hit._source.cohort,
    pathways: hit._source.pathways.map((pathway) =>
      pathwaysSnakeToCamel(pathway),
    ),
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
    cohort: hit._source.cohort,
    pathways: hit._source.pathways.map((pathway) =>
      pathwaysSnakeToCamel(pathway),
    ),
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
