import { StoryFn } from "@storybook/react";

import { BrowseFiltersProvider } from "@/context/BrowseFilters";
import { CurriculumFilters } from "@/utils/curriculum/types";

// Components under test read filters/onChangeFilters from BrowseFilters context, not props
export default function withBrowseFilters(initialFilter: CurriculumFilters) {
  return function BrowseFiltersDecorator(Story: StoryFn) {
    return (
      <BrowseFiltersProvider defaultFilter={initialFilter}>
        <Story />
      </BrowseFiltersProvider>
    );
  };
}
