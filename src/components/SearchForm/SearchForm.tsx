import { FC, useContext, useState } from "react";
import { useRouter } from "next/router";

import { SearchContext } from "../../context/SearchContext";

const SearchForm: FC = () => {
  const { text, setText } = useContext(SearchContext);
  const [value, setValue] = useState(text);
  const router = useRouter();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setText(value);
    router.push("/search");
  };

  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    setValue(e.currentTarget.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={value}
        type="search"
        onChange={onChange}
        aria-label="Search"
        placeholder="Search"
      />
      <button type="submit">Submit</button>
      {/* TODO: add key stage filter UI */}
    </form>
  );
};

export default SearchForm;
