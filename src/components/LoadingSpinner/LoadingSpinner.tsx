import { FC } from "react";

import ScreenReaderOnly from "../ScreenReaderOnly";

import styles from "./LoadingSpinner.module.css";

const LoadingSpinner: FC = () => {
  return (
    <span className={styles["loading-spinner"]}>
      <ScreenReaderOnly>Loading</ScreenReaderOnly>
    </span>
  );
};

export default LoadingSpinner;
