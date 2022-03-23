import { FC } from "react";

import styles from "./SiteHeader.module.css";

const SiteHeader: FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.title}>Oak</div>
      <input type="text" placeholder="Search" />
    </header>
  );
};

export default SiteHeader;
