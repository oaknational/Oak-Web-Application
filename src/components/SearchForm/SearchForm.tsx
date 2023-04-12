import {
  FC,
  useState,
  useCallback,
  ChangeEventHandler,
  FormEventHandler,
} from "react";
import styled from "styled-components";

import IconButton from "../Button/IconButton";
import flex, { FlexCssProps } from "../../styles/utils/flex";
import spacing, { margin, SpacingProps } from "../../styles/utils/spacing";
import UnstyledInput from "../UnstyledInput";
import ButtonBorders from "../SpriteSheet/BrushSvgs/ButtonBorders";
import getColorByLocation from "../../styles/themeHelpers/getColorByLocation";
import getFontFamily from "../../styles/themeHelpers/getFontFamily";
import { getBreakpoint } from "../../styles/utils/responsive";
import Flex from "../Flex";
import {
  InputFieldWrap,
  InputFocusUnderline,
  StyledInputProps,
} from "../Input/Input";

const StyledForm = styled.form<FlexCssProps & SpacingProps>`
  ${flex}
  ${spacing}
  display: flex;
`;

const StyledInput = styled(UnstyledInput)<StyledInputProps>`
  color: ${getColorByLocation(({ theme }) => theme.input.states.default.text)};
  height: ${(props) => props.theme.input.height};
  border-radius: ${(props) => props.theme.input.borderRadius};
  border-color: ${getColorByLocation(
    ({ theme }) => theme.input.states.default.border
  )};
  border-width: ${(props) => props.theme.input.borderWidth};
  font-size: 16px;
  font-family: ${getFontFamily("ui")};
  font-weight: 300;
  width: 100%;
  padding-left: 8px;
  outline: none;

  @media (max-width: ${getBreakpoint("small")}px) {
    /* iOS zooms in on inputs with font sizes <16px on mobile */
    font-size: 16px;
  }

  ::placeholder {
    font-family: ${getFontFamily("ui")};
    color: ${getColorByLocation(
      ({ theme }) => theme.input.states.default.placeholder
    )};
    opacity: 1;
  }

  :valid:not([value=""]) {
    border-color: ${getColorByLocation(
      ({ theme }) => theme.input.states.valid.border
    )};

    ::placeholder {
      font-size: 14px;
      color: ${getColorByLocation(
        ({ theme }) => theme.input.states.valid.placeholder
      )};
    }
  }

  ${margin}
`;

type SearchFormProps = {
  searchTerm: string;
  handleSubmit: ({ searchTerm }: { searchTerm: string }) => void;
};
const SearchForm: FC<SearchFormProps> = (props) => {
  const { handleSubmit, searchTerm } = props;
  const [value, setValue] = useState(searchTerm);

  const onChange = useCallback<ChangeEventHandler<HTMLInputElement>>((e) => {
    setValue(e.target.value);
  }, []);

  const onSubmit = useCallback<FormEventHandler<HTMLFormElement>>(
    (e) => {
      e.preventDefault();
      handleSubmit({ searchTerm: value });
    },
    [value, handleSubmit]
  );

  return (
    <StyledForm
      role="search"
      $flexWrap="nowrap"
      onSubmit={onSubmit}
      $ml={4}
      $alignItems={"center"}
    >
      <Flex $position={"relative"} $width={"100%"}>
        <InputFieldWrap $width={"100%"}>
          <StyledInput
            id="search-form-search-input"
            value={value}
            type="search"
            onChange={onChange}
            placeholder="Search"
          />
          <InputFocusUnderline aria-hidden="true" name={"underline-1"} />
          <ButtonBorders background={"white"} />
        </InputFieldWrap>
      </Flex>
      <IconButton
        icon="go"
        aria-label="Submit"
        htmlButtonProps={{ type: "submit" }}
        size={"large"}
        $ml={20}
      />
    </StyledForm>
  );
};

export default SearchForm;
