import { FC, useState, FormEvent } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";

import { useSearchQuery } from "../../context/Search/SearchContext";
import IconButton from "../Button/IconButton";
import flex, { FlexCssProps } from "../../styles/utils/flex";
import BigInput from "../Input/BigInput";

const StyledForm = styled.form<FlexCssProps>`
  ${flex}
  display: flex;
`;

const SearchForm: FC = () => {
  const { text, setText } = useSearchQuery();
  const [value, setValue] = useState(text);

  const router = useRouter();
  const handleSubmit = (e: FormEvent<HTMLFormElement | HTMLButtonElement>) => {
    e.preventDefault();
    setText(value);
    router.push("/search");
  };

  const onTextChange = (e: FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    setValue(e.currentTarget.value);
  };

  return (
    <StyledForm flexWrap="nowrap" onSubmit={handleSubmit}>
      <BigInput
        value={value}
        type="search"
        onChange={onTextChange}
        aria-label="Search"
        placeholder="Search"
      />
      <IconButton
        onClick={handleSubmit}
        icon="Search"
        aria-label="Submit"
        htmlButtonProps={{ type: "submit" }}
        ml={12}
      />
    </StyledForm>
  );
};

export default SearchForm;
