import {
  FC,
  useState,
  useCallback,
  ChangeEventHandler,
  FormEventHandler,
  useEffect,
} from "react";
import styled from "styled-components";
import {
  OakFlex,
  OakFlexProps,
  OakPrimaryButton,
  OakTextInput,
} from "@oaknational/oak-components";

import spacing, { SpacingProps } from "@/styles/utils/spacing";
import useAnalytics from "@/context/Analytics/useAnalytics";
import { ContextValueType, SearchSourceValueType } from "@/browser-lib/avo/Avo";

const StyledForm = styled(OakFlex)<OakFlexProps & SpacingProps>`
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

  // Keep searchTerm in sync with the value of the input
  useEffect(() => {
    setValue(searchTerm);
  }, [searchTerm]);

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
    <StyledForm
      as="form"
      role="search"
      onSubmit={onSubmit}
      $alignItems={"center"}
    >
      <OakFlex
        $width={"100%"}
        $flexDirection={"row"}
        $alignItems={"center"}
        $gap="spacing-16"
      >
        <OakTextInput
          $mb={"spacing-0"}
          id="search-form-search-input"
          value={value}
          type="search"
          onChange={onChange}
          placeholder={placeholderText}
          onFocus={() => {
            trackSearchJourneyInitiated();
          }}
          wrapperWidth="100%"
          $pv="spacing-0"
          $height="spacing-56"
        />
        <OakPrimaryButton
          iconName="search"
          pv="spacing-16"
          width="min-content"
          iconGap="spacing-0"
          aria-label="submit"
        />
      </OakFlex>
    </StyledForm>
  );
};

export default SearchForm;
