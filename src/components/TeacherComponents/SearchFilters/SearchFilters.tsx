import { FC } from "react";
import { OakP } from "@oaknational/oak-components";

import SearchFilterCheckbox from "@/components/TeacherComponents/SearchFilterCheckbox";
import Flex from "@/components/SharedComponents/Flex";
import { UseSearchFiltersReturnType } from "@/context/Search/search.types";

type SearchFiltersProps = {
  searchRefined: (filterType: string, filterValue: string) => void;
} & UseSearchFiltersReturnType;

const SearchFilters: FC<SearchFiltersProps> = (props) => {
  const {
    keyStageFilters,
    subjectFilters,
    contentTypeFilters,
    examBoardFilters,
    searchRefined,
  } = props;
  return (
    <>
      <OakP $mb="space-between-s" $font={"heading-7"}>
        Type
      </OakP>
      <Flex $mb={36} $flexWrap={"wrap"}>
        {contentTypeFilters.map((contentType) => (
          <SearchFilterCheckbox
            name={"typeFilters"}
            label={contentType.title}
            key={`search-filters-type-${contentType.slug}`}
            width={"50%"}
            filterType={"Content type filter"}
            searchRefined={searchRefined}
            {...contentType}
          />
        ))}
      </Flex>
      <OakP $mb="space-between-s" $font={"heading-7"}>
        Exam board
      </OakP>
      <Flex $mb={36} $flexWrap={"wrap"}>
        {examBoardFilters.map((examBoard) => (
          <SearchFilterCheckbox
            name={"examBoardFilters"}
            label={examBoard.title}
            key={`search-filters-examBoard-${examBoard.slug}`}
            width={"50%"}
            filterType="Exam board filter"
            searchRefined={searchRefined}
            {...examBoard}
          />
        ))}
      </Flex>
      <OakP $mb="space-between-s" $font={"heading-7"}>
        Key stage
      </OakP>
      <Flex $mb={36} $flexDirection={"row"} $flexWrap={"wrap"}>
        {keyStageFilters.map((keyStageFilter) => (
          <SearchFilterCheckbox
            name={"keyStageFilters"}
            label={keyStageFilter.shortCode}
            key={`search-filters-keyStage-${keyStageFilter.slug}`}
            filterType="Key stage filter"
            searchRefined={searchRefined}
            {...keyStageFilter}
          />
        ))}
      </Flex>
      <OakP $mb="space-between-s" $font={"heading-7"}>
        Subjects
      </OakP>
      <Flex $flexDirection={"column"}>
        {subjectFilters.map((subjectFilter) => (
          <SearchFilterCheckbox
            width={"100%"}
            name={"subjectFilters"}
            label={subjectFilter.title}
            key={`search-filters-subject-${subjectFilter.slug}`}
            filterType="Subject filter"
            searchRefined={searchRefined}
            {...subjectFilter}
          />
        ))}
      </Flex>
    </>
  );
};

export default SearchFilters;
