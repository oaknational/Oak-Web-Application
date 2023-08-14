import { z } from "zod";

import errorReporter from "../../common-lib/error-reporter";
import { LessonListItemProps } from "../../components/UnitAndLessonLists/LessonList/LessonListItem";
import { UnitListItemProps } from "../../components/UnitAndLessonLists/UnitList/UnitListItem/UnitListItem";
import OakError from "../../errors/OakError";
import truthy from "../../utils/truthy";

import { KeyStage } from "./useSearchFilters";

const reportError = errorReporter("search/helpers");

export const isFilterItem = <T extends { slug: string }>(
  slug: string,
  allFilterItems: T[]
) => {
  return allFilterItems.some((item) => item.slug === slug);
};

export const getFilterForQuery = <T extends { slug: string }>(
  queryFilterItems: string | string[],
  allFilterItems: T[]
) => {
  const queryFilterArray = queryFilterItems.toString().split(",");
  return queryFilterArray.filter((querySlug) =>
    isFilterItem(querySlug, allFilterItems)
  );
};

// Analytics
export const getSortedSearchFiltersSelected = (
  filterOptions: string | string[] | undefined
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
    (keyStage) => lastChar(keyStage.slug) === lastChar(elasticKeyStageSlug)
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
  allKeyStages: KeyStage[]
) => {
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
> {
  const { hit, allKeyStages } = props;
  const { _source, highlight } = hit;
  const highlightedHit = { ..._source, ...highlight };
  const keyStage = elasticKeyStageSlugToKeyStage({
    elasticKeyStageSlug: highlightedHit.key_stage_slug.toString(),
    allKeyStages,
  });
  return {
    programmeSlug: getProgrammeSlug(hit, allKeyStages),
    lessonTitle: highlightedHit.title?.toString(),
    lessonSlug: highlightedHit.slug?.toString(),
    description: highlightedHit.lesson_description?.toString() || "",
    subjectSlug: highlightedHit.subject_slug?.toString(),
    keyStageSlug: keyStage?.slug?.toString() || "",
    keyStageTitle: keyStage?.title?.toString() || "",
    subjectTitle: highlightedHit.subject_title?.toString(),
    unitSlug: highlightedHit.topic_slug?.toString() || "",
    unitTitle: highlightedHit.topic_title?.toString() || "",
    videoCount: null,
    presentationCount: null,
    worksheetCount: null,
    hasCopyrightMaterial: false, // this will need to be added to elastic search
    quizCount: null,
    expired: Boolean(highlightedHit.expired),
  };
}

export function getUnitObject(props: {
  hit: UnitSearchHit;
  allKeyStages: KeyStage[];
}): Omit<
  UnitListItemProps,
  "hideTopHeading" | "index" | "hitCount" | "expiredLessonCount"
> {
  const { hit, allKeyStages } = props;
  const { _source, highlight } = hit;
  const highlightedHit = { ..._source, ...highlight };
  const keyStage = elasticKeyStageSlugToKeyStage({
    elasticKeyStageSlug: highlightedHit.key_stage_slug.toString(),
    allKeyStages,
  });

  return {
    programmeSlug: getProgrammeSlug(hit, allKeyStages),
    title: highlightedHit.title?.toString(),
    nullTitle: highlightedHit.title?.toString(),
    slug: highlightedHit.slug?.toString(),
    themeTitle: highlightedHit.theme_title?.toString() || null,
    themeSlug: null, // null values need to be added to elastic search
    lessonCount: null,
    quizCount: null,
    subjectSlug: highlightedHit.subject_slug?.toString(),
    subjectTitle: highlightedHit.subject_title?.toString(),
    keyStageSlug: keyStage?.slug?.toString() || "",
    keyStageTitle: keyStage?.title?.toString() || "",
    expired: Boolean(highlightedHit.expired),
    learningThemes: [{ themeSlug: null, themeTitle: null }],
  };
}

const searchResultsSourceCommon = z.object({
  id: z.number(),
  slug: z.string(),
  title: z.string(),
  subject_title: z.string(),
  subject_slug: z.string(),
  key_stage_title: z.string(),
  key_stage_slug: z.string(),
  expired: z.boolean().nullish(),
  theme_title: z.string().nullish(),
  tier: z.string().nullish(),
  phase: z.string().nullish(),
});

const searchResultsSourceLessonSchema = searchResultsSourceCommon.extend({
  type: z.string(),
  lesson_description: z.string().nullish(),
  // topic slug/title are deprecated terms for unit slug/title
  topic_title: z.string().nullish(),
  topic_slug: z.string().nullish(),
  has_copyright_material: z.boolean().nullish(),
});

const searchResultsSourceUnitSchema = searchResultsSourceCommon.extend({
  type: z.literal("unit"),
  year_slug: z.string().nullish(),
  number_of_lessons_calculated: z.number().nullish(),
  number_of_lessons_expired: z.number().nullish(),
});

const searchResultsHighlightLessonSchema = z.object({
  lesson_description: z.coerce.string(),
  topic_title: z.coerce.string(),
});

const searchResultsHighlightUnitSchema = z.object({
  topic_title: z.coerce.string(),
});

export const lessonSearchHitSchema = z.object({
  _id: z.string(),
  _index: z.string(),
  _score: z.number(),
  _ignored: z.array(z.string()).nullish(),
  _source: searchResultsSourceLessonSchema,
  highlight: searchResultsHighlightLessonSchema.partial().nullish(),
});
export const unitSearchHitSchema = z.object({
  _id: z.string(),
  _index: z.string(),
  _score: z.number(),
  _source: searchResultsSourceUnitSchema,
  highlight: searchResultsHighlightUnitSchema.partial().nullish(),
});
export const searchResultsHitSchema = z.union([
  lessonSearchHitSchema,
  unitSearchHitSchema,
]);
export const searchResultsHitsSchema = z.array(searchResultsHitSchema);
export const searchResultsSchema = z.object({
  took: z.number(),
  hits: z.object({
    hits: z.array(searchResultsHitSchema),
  }),
});

export type LessonSearchHit = z.infer<typeof lessonSearchHitSchema>;
export type UnitSearchHit = z.infer<typeof unitSearchHitSchema>;

export function isLessonSearchHit(x: SearchHit): x is LessonSearchHit {
  return x._source.type === "lesson";
}

export type SearchHit = z.infer<typeof searchResultsHitSchema>;
