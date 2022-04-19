import { FC, useContext, useState } from "react";
import { useRouter } from "next/router";

import { searchContext, KeyStages } from "../../context/SearchContext";

import styles from "./SearchForm.module.css";

const SearchForm: FC = () => {
  const { text, setText, keystage, setKeystage } = useContext(searchContext);
  const [value, setValue] = useState(text);

  const initialChecks = Array(Object.keys(KeyStages).length).fill(false);
  const [checks, setChecks] = useState(initialChecks);

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

  const handleOnCheck = (position: number, ks: string) => {
    const updatedChecks = checks.map((item: boolean, index: number) =>
      // reverse the boolean of the checkbox we have selected
      // keep the others the same
      index === position ? !item : item
    );

    setChecks(updatedChecks);

    if (!checks[position]) {
      setKeystage(keystage.add(ks));
    } else {
      keystage.delete(ks);
      setKeystage(keystage);
    }
  };

  const keyStageChecks: Array<JSX.Element> = (
    Object.values(KeyStages) as Array<keyof typeof KeyStages>
  ).map((ks: string, index: number) => {
    return (
      <div key={ks}>
        <input
          type="checkbox"
          id={`custom-checkbox-${ks}`}
          name={ks}
          value={ks}
          checked={checks[index]}
          onChange={() => handleOnCheck(index, ks)}
        />
        <label htmlFor={value}>{ks}</label>
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
