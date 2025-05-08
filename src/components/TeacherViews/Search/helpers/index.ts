import {
  FilterTypeValueType,
  KeyStageTitleValueType,
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
};

export const trackSearchModified =
  (
    query: string,
    searchFilterModified: (props: SearchFilterModifiedProperties) => void,
  ) =>
  ({ checked, filterType, filterValue }: TrackSearchModifiedProps) => {
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
    });
  };
