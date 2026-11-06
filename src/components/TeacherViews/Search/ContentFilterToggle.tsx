import {
  isValidIconName,
  OakFlex,
  OakSearchFilterCheckBox,
  OakSearchFilterCheckBoxProps,
} from "@oaknational/oak-components";

import {
  ContentType,
  SearchCheckBoxProps,
} from "@/context/Search/search.types";
import { FilterTypeValueType } from "@/browser-lib/avo/Avo";
import { useUpdateSearchQuery } from "@/app/(core)/teachers/search/helpers/updateSearchQuery";

type ContentFilterToggleProps = {
  contentTypeFilters: (ContentType & SearchCheckBoxProps)[];
  idSuffix: string;
  trackSearchModified: (
    checked: boolean,
    filterType: FilterTypeValueType,
    filterValue: string,
  ) => void;
};

export const ContentFilterToggle = (props: ContentFilterToggleProps) => {
  const { contentTypeFilters, trackSearchModified, idSuffix } = props;
  const { updateSearchFilters } = useUpdateSearchQuery();
  return (
    <OakFlex $gap={"spacing-12"}>
      {contentTypeFilters
        .map((contentTypeFilter) => {
          const icon = isValidIconName(`teacher-${contentTypeFilter.slug}`)
            ? (`teacher-${contentTypeFilter.slug}` as OakSearchFilterCheckBoxProps["icon"])
            : undefined;

          return (
            <OakSearchFilterCheckBox
              name={"typeFilters"}
              displayValue={contentTypeFilter.title}
              key={`search-filters-type-${contentTypeFilter.slug}-${idSuffix}`}
              aria-label={`${contentTypeFilter.title} filter`}
              id={`search-filters-type-${contentTypeFilter.slug}-${idSuffix}`}
              icon={icon}
              value={"Content type filter"}
              keepIconColor={true}
              checked={contentTypeFilter.checked}
              onChange={() => {
                trackSearchModified(
                  contentTypeFilter.checked,
                  "Content type filter",
                  contentTypeFilter.slug,
                );
                updateSearchFilters({
                  filterType: "contentTypes",
                  filterSlug: contentTypeFilter.slug,
                });
              }}
            />
          );
        })
        .reverse()}
    </OakFlex>
  );
};
