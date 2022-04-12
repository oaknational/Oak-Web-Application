import { FC } from "react";

import styles from "./ScreenReaderOnly.module.css";

/**
 * 
 * @description This component will visually hide its contents but will still be available
 * to screen readers, assitive technology, and scrapers.
 */
const ScreenReaderOnly: FC = (props) => {
  return <div {...props} className={styles.visuallyHidden} />;
};

export default ScreenReaderOnly;
