import {
  FC,
  useState,
  useCallback,
  ChangeEventHandler,
  FormEventHandler,
} from "react";
import styled from "styled-components";

import {
  OakFlex,
  OakPrimaryButton,
  OakTextInput,
} from "@oaknational/oak-components";
import flex, { FlexCssProps } from "@/styles/utils/flex";
import spacing, { SpacingProps } from "@/styles/utils/spacing";
import useAnalytics from "@/context/Analytics/useAnalytics";
import { ContextValueType, SearchSourceValueType } from "@/browser-lib/avo/Avo";

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
    },
    [handleSubmit, value],
  );

  return (
    <StyledForm role="search" onSubmit={onSubmit} $alignItems={"center"}>
      <OakFlex
        $width={"100%"}
        $flexDirection={"row"}
        $alignItems={"center"}
        $gap="space-between-s"
      >
        <OakTextInput
          $mb={"space-between-none"}
          id="search-form-search-input"
          value={value}
          type="search"
          onChange={onChange}
          placeholder={placeholderText}
          onFocus={() => {
            trackSearchJourneyInitiated();
          }}
          wrapperWidth="100%"
          $pv="inner-padding-none"
          $height="all-spacing-10"
        />
        <OakPrimaryButton
          iconName="search"
          pv="inner-padding-m"
          width="min-content"
          iconGap="all-spacing-0"
        />
      </OakFlex>
    </StyledForm>
  );
};

export default SearchForm;
