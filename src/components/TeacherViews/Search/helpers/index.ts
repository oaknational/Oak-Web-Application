import {
  examboardSlugs,
  keystageSlugs,
  subjectSlugs,
  yearSlugs,
} from "@oaknational/oak-curriculum-schema";

import {
  FilterTypeValueType,
  KeyStageTitleValueType,
  SearchFilterMatchTypeValueType,
  SearchFilterModifiedProperties,
} from "@/browser-lib/avo/Avo";

export const convertUnitSlugToTitle = (unitSlug: string) => {
  const lastHyphenIndex = unitSlug.lastIndexOf("-");
  const truncatedSlug =
    lastHyphenIndex !== -1 ? unitSlug.substring(0, lastHyphenIndex) : unitSlug;
  const words = truncatedSlug.split("-");
  const capitalisedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1),
  );
  const title = capitalisedWords.join(" ").trim();
  return title;
};

export const removeHTMLTags = (str: string) => {
  return str.replace(/(<([^>]+)>)/gi, "");
};

export const isKeyStageTitleValueType = (
  value: string,
): value is KeyStageTitleValueType => {
  return (
    value === "Key stage 1" ||
    value === "Key stage 2" ||
    value === "Key stage 3" ||
    value === "Key stage 4"
  );
};

export type TrackSearchModifiedProps = {
  checked: boolean;
  filterType: FilterTypeValueType;
  filterValue: string;
  searchFilterMatchType: SearchFilterMatchTypeValueType;
};

export const getFilterType = (slug: string) => {
  const isKeystageFilter = keystageSlugs.safeParse(slug).success;
  const isYearFilter = yearSlugs.safeParse(slug).success;
  const isSubjectFilter = subjectSlugs.safeParse(slug).success;
  const isContentTypeFilter = slug === "lesson" || slug === "unit";
  const isExamBoardFilter = examboardSlugs.safeParse(slug).success;

  if (isKeystageFilter) {
    return "Key stage filter" as FilterTypeValueType;
  } else if (isYearFilter) {
    return "Year filter" as FilterTypeValueType;
  } else if (isSubjectFilter) {
    return "Subject filter" as FilterTypeValueType;
  } else if (isContentTypeFilter) {
    return "Content type filter" as FilterTypeValueType;
  } else if (isExamBoardFilter) {
    return "Exam board filter" as FilterTypeValueType;
  } else if (slug === "new") {
    return "Lesson Cohort filter" as FilterTypeValueType;
  } else {
    return "Unknown filter" as FilterTypeValueType;
  }
};

export const trackSearchModified =
  (
    query: string,
    searchFilterModified: (props: SearchFilterModifiedProperties) => void,
  ) =>
  ({
    checked,
    filterType,
    filterValue,
    searchFilterMatchType,
  }: TrackSearchModifiedProps) => {
    const filterModificationType = checked ? "remove" : "add";
    searchFilterModified({
      platform: "owa",
      product: "teacher lesson resources",
      engagementIntent: "refine",
      componentType: "filter_link",
      eventVersion: "2.0.0",
      analyticsUseCase: "Teacher",
      filterModificationType,
      filterType,
      filterValue,
      searchTerm: query,
      searchFilterMatchType,
    });
  };
