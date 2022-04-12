import { FC } from "react";

import ScreenReaderOnly from "../ScreenReaderOnly";

import styles from "./LoadingSpinner.module.css";

const LoadingSpinner: FC = () => {
  //@TODO: implement a SrOnly "Loading" inner text
  return (
    <div className={styles["loading-spinner"]}>
      <ScreenReaderOnly>Loading</ScreenReaderOnly>
    </div>
  );
};

export default LoadingSpinner;
