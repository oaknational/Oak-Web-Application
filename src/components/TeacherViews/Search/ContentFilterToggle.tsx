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
              {...contentTypeFilter}
              onChange={() => {
                trackSearchModified(
                  contentTypeFilter.checked,
                  "Content type filter",
                  contentTypeFilter.slug,
                );
                contentTypeFilter.onChange();
              }}
            />
          );
        })
        .reverse()}
    </OakFlex>
  );
};
