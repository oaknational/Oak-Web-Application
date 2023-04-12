import { FC, useState, FormEvent } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";

import { useSearchQuery } from "../../context/Search/SearchContext";
import IconButton from "../Button/IconButton";
import flex, { FlexCssProps } from "../../styles/utils/flex";
import spacing, { margin, SpacingProps } from "../../styles/utils/spacing";
import { resolveOakHref } from "../../common-lib/urls";
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

const SearchForm: FC = () => {
  const { text, setText } = useSearchQuery();
  const [value, setValue] = useState(text);

  const router = useRouter();
  const handleSubmit = (e: FormEvent<HTMLFormElement | HTMLButtonElement>) => {
    e.preventDefault();
    setText(value);
    const searchPage = resolveOakHref({ page: "beta-search" });
    router.push({
      pathname: searchPage,
      query: { term: value },
    });
  };

  const onTextChange = (e: FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    setValue(e.currentTarget.value);
  };

  return (
    <StyledForm
      $flexWrap="nowrap"
      onSubmit={handleSubmit}
      $ml={4}
      $alignItems={"center"}
    >
      <Flex $position={"relative"} $width={"100%"}>
        <InputFieldWrap $width={"100%"}>
          <StyledInput
            id="search-form-search-input"
            value={value}
            type="search"
            onChange={onTextChange}
            onBlur={() => console.log("blur")}
            placeholder="Search"
          />
          <InputFocusUnderline aria-hidden="true" name={"underline-1"} />
          <ButtonBorders background={"white"} />
        </InputFieldWrap>
      </Flex>
      <IconButton
        onClick={handleSubmit}
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
