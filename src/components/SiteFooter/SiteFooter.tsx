import { FC } from "react";

import styles from "./SiteFooter.module.css";

const SiteFooter: FC = () => {
  return (
    <footer className={styles.footer}>
      © Oak National Academy {new Date().getFullYear()}
    </footer>
  );
};

export default SiteFooter;
