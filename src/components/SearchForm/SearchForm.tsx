import { FC, useState } from "react";
import { useRouter } from "next/router";

import {
  KeyStages,
  KeyStage,
  useSearchQuery,
} from "../../context/SearchContext";

import styles from "./SearchForm.module.css";

const SearchForm: FC = () => {
  const { text, setText, keyStages, setKeyStages } = useSearchQuery();
  const [value, setValue] = useState(text);

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

  const handleOnCheck = (ks: KeyStage) => {
    const newKeyStages = new Set(keyStages);
    if (!keyStages.has(ks)) {
      newKeyStages.add(ks);
    } else {
      newKeyStages.delete(ks);
    }
    setKeyStages(newKeyStages);
  };

  const keyStageChecks: Array<JSX.Element> = Object.values(KeyStages).map(
    (ks: KeyStage) => {
      return (
        <div key={ks}>
          <label>
            &nbsp;Key Stage {ks}
            <input
              type="checkbox"
              id={`custom-checkbox-${ks}`}
              name={ks}
              value={ks}
              checked={keyStages.has(ks)}
              onChange={() => handleOnCheck(ks)}
            />
          </label>
        </div>
      );
    }
  );

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
