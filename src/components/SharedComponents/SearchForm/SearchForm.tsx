import {
  FC,
  useState,
  useCallback,
  ChangeEventHandler,
  FormEventHandler,
} from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import { OakFlex } from "@oaknational/oak-components";

import flex, { FlexCssProps } from "@/styles/utils/flex";
import spacing, { SpacingProps } from "@/styles/utils/spacing";
import useAnalytics from "@/context/Analytics/useAnalytics";
import { getSortedSearchFiltersSelected } from "@/context/Search/search.helpers";
import { ContextValueType, SearchSourceValueType } from "@/browser-lib/avo/Avo";
import useAnalyticsPageProps from "@/hooks/useAnalyticsPageProps";
import Input from "@/components/SharedComponents/Input/Input";
import Button from "@/components/SharedComponents/Button";

const StyledForm = styled.form<FlexCssProps & SpacingProps>`
  ${flex}
  ${spacing}
  display: flex;
`;

type SearchFormProps = {
  searchTerm: string;
  placeholderText: string;
  handleSubmit: ({ searchTerm }: { searchTerm: string }) => void;
  analyticsSearchSource: SearchSourceValueType;
  searchContext: ContextValueType;
};
const SearchForm: FC<SearchFormProps> = (props) => {
  const {
    handleSubmit,
    searchTerm,
    analyticsSearchSource,
    placeholderText,
    searchContext,
  } = props;
  const [value, setValue] = useState(searchTerm);
  const { track } = useAnalytics();
  const { analyticsUseCase, pageName } = useAnalyticsPageProps();
  const router = useRouter();

  const useCase =
    pageName === "Homepage" && !analyticsUseCase ? "Teacher" : analyticsUseCase;

  const trackSearchAttempted = useCallback(() => {
    track.searchAttempted({
      searchTerm: value,
      analyticsUseCase: useCase,
      pageName,
      searchFilterOptionSelected: getSortedSearchFiltersSelected(router.query),
      searchSource: analyticsSearchSource,
      context: searchContext,
    });
  }, [
    track,
    value,
    useCase,
    pageName,
    router.query,
    analyticsSearchSource,
    searchContext,
  ]);

  const trackSearchJourneyInitiated = useCallback(() => {
    track.searchJourneyInitiated({
      searchSource: analyticsSearchSource,
      context: searchContext,
    });
  }, [analyticsSearchSource, track, searchContext]);

  const onChange = useCallback<ChangeEventHandler<HTMLInputElement>>((e) => {
    setValue(e.target.value);
  }, []);

  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (e) => {
      e.preventDefault();
      handleSubmit({ searchTerm: value });
      trackSearchAttempted();
    },
    [handleSubmit, trackSearchAttempted, value],
  );

  return (
    <StyledForm role="search" onSubmit={onSubmit} $alignItems={"center"}>
      <OakFlex $width={"100%"} $flexDirection={"row"} $alignItems={"center"}>
        <Input
          $mb={0}
          label="Search"
          id="search-form-search-input"
          value={value}
          type="search"
          onChange={onChange}
          placeholder={placeholderText}
          onFocus={() => {
            trackSearchJourneyInitiated();
          }}
        />

        <Button
          icon="search"
          label="Search"
          shouldHideLabel={[true]}
          iconBackground="black"
          aria-label="Submit"
          htmlButtonProps={{ type: "submit" }}
          size={"large"}
          $ml={20}
        />
      </OakFlex>
    </StyledForm>
  );
};

export default SearchForm;
