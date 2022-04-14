import { FC, useContext, useState } from "react";
import { useRouter } from "next/router";

import { SearchContext, KeyStages } from "../../context/SearchContext";

import styles from "./SearchForm.module.css";

const SearchForm: FC = () => {
  const { text, setText } = useContext(SearchContext);
  const [value, setValue] = useState(text);
  const [checks, setChecks] = useState(
    new Array(Object.keys(KeyStages).length)
  );
  const router = useRouter();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setText(value);
    router.push("/search");
  };

  const onTextChange = (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();
    setValue(e.currentTarget.value);
  };

  const handleOnCheck = (position: number) => {
    const updatedChecks = checks.map((item: boolean, index: number) =>
      // reverse the boolean of the checkbox we have selected
      // keep the others the same
      index === position ? !item : item
    );

    setChecks(updatedChecks);
  };

  const keyStageChecks: Array<JSX.Element> = (
    Object.values(KeyStages) as Array<keyof typeof KeyStages>
  ).map((key: string, index: number) => {
    return (
      <div key={key}>
        <input
          type="checkbox"
          id={`custom-checkbox-${key}`}
          name={key}
          value={key}
          checked={checks[index]}
          onChange={() => handleOnCheck(index)}
        />
        <label htmlFor={key}>{key}</label>
      </div>
    );
  });

  return (
    <form onSubmit={handleSubmit} className={styles.search}>
      <input
        value={value}
        type="search"
        onChange={onTextChange}
        aria-label="Search"
        placeholder="Search"
      />

      <button type="submit">Submit</button>
      {keyStageChecks}
    </form>
  );
};

export default SearchForm;
