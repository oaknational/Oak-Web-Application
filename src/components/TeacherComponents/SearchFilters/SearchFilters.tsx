import { FC } from "react";
import { OakP, OakFlex } from "@oaknational/oak-components";
import styled from "styled-components";

import SearchFilterCheckbox from "@/components/TeacherComponents/SearchFilterCheckbox";
import { UseSearchFiltersReturnType } from "@/context/Search/search.types";
import { FilterTypeValueType } from "@/browser-lib/avo/Avo";

type SearchFiltersProps = {
  searchRefined: (filterType: FilterTypeValueType, filterValue: string) => void;
} & UseSearchFiltersReturnType;

const StyledFieldset = styled.fieldset`
  border: 0px;
  margin: 0;
  padding: 0;
`;

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
      <StyledFieldset>
        <OakP as={"legend"} $mb="space-between-s" $font={"heading-7"}>
          Type
        </OakP>
        <OakFlex $mb="space-between-m2" $flexWrap={"wrap"}>
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
        </OakFlex>
      </StyledFieldset>
      <StyledFieldset>
        <OakP as={"legend"} $mb="space-between-s" $font={"heading-7"}>
          Exam board
        </OakP>
        <OakFlex $mb="space-between-m2" $flexWrap={"wrap"}>
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
        </OakFlex>
      </StyledFieldset>
      <StyledFieldset>
        <OakP as={"legend"} $mb="space-between-s" $font={"heading-7"}>
          Key stage
        </OakP>
        <OakFlex
          $mb="space-between-m2"
          $flexDirection={"row"}
          $flexWrap={"wrap"}
        >
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
        </OakFlex>
      </StyledFieldset>
      <StyledFieldset>
        <OakP as={"legend"} $mb="space-between-s" $font={"heading-7"}>
          Subjects
        </OakP>
        <OakFlex $flexDirection={"column"}>
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
        </OakFlex>
      </StyledFieldset>
    </>
  );
};

export default SearchFilters;
