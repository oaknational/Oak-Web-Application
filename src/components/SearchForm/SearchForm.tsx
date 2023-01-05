import { FC, useState, FormEvent } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";

import { useSearchQuery } from "../../context/Search/SearchContext";
import IconButton from "../Button/IconButton";
import flex, { FlexCssProps } from "../../styles/utils/flex";
import Input from "../Input";
import spacing, { SpacingProps } from "../../styles/utils/spacing";
import { resolveOakHref } from "../../common-lib/urls";

const StyledForm = styled.form<FlexCssProps & SpacingProps>`
  ${flex}
  ${spacing}
  display: flex;
`;

const SearchForm: FC = () => {
  const { text, setText } = useSearchQuery();
  const [value, setValue] = useState(text);

  const router = useRouter();
  const handleSubmit = (e: FormEvent<HTMLFormElement | HTMLButtonElement>) => {
    e.preventDefault();
    setText(value);
    const searchPage = resolveOakHref({ page: "beta-search" });
    if (router.pathname !== searchPage)
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
    <StyledForm $flexWrap="nowrap" onSubmit={handleSubmit} $ml={[16, 16, 16]}>
      <Input
        id="search-form-search-input"
        value={value}
        type="search"
        onChange={onTextChange}
        label="Search"
        placeholder="Search"
      />
      <IconButton
        onClick={handleSubmit}
        icon="Search"
        aria-label="Submit"
        htmlButtonProps={{ type: "submit" }}
        $ml={12}
      />
    </StyledForm>
  );
};

export default SearchForm;
