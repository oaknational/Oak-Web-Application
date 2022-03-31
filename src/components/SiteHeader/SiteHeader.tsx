import { FC } from "react";

import SearchForm from "../SearchForm";

import styles from "./SiteHeader.module.css";

const SiteHeader: FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.title}>Oak</div>
      <SearchForm />
    </header>
  );
};

export default SiteHeader;
