import { FC } from "react";

import VisuallyHidden from "../VisuallyHidden";

import styles from "./LoadingSpinner.module.css";

const LoadingSpinner: FC = () => {
  //@TODO: implement a SrOnly "Loading" inner text
  return (
    <div className={styles["loading-spinner"]}>
      <VisuallyHidden>Loading</VisuallyHidden>
    </div>
  );
};

export default LoadingSpinner;
