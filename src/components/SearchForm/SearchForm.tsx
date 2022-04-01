import { FC, useContext, useState } from "react";
import { useRouter } from "next/router";

import { SearchContext } from "../../context/SearchContext";

const SearchForm: FC = () => {
  const { text, setText, setKeystage } = useContext(SearchContext);
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
      <input value={value} type="search" onChange={onChange} />
      <button type="submit">Submit</button>
      {/* <button type="button" on>Foundation</button> */}
      <button
        type="button"
        onClick={() => {
          setKeystage("1");
        }}
      >
        Key Stage 1
      </button>
      <button
        type="button"
        onClick={() => {
          setKeystage("2");
        }}
      >
        Key Stage 2
      </button>
      <button
        type="button"
        onClick={() => {
          setKeystage("3");
        }}
      >
        Key Stage 3
      </button>
      <button
        type="button"
        onClick={() => {
          setKeystage("4");
        }}
      >
        Key Stage 4
      </button>
      <button
        type="button"
        onClick={() => {
          setKeystage("");
        }}
      >
        All
      </button>
    </form>
  );
};

export default SearchForm;
