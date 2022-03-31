import { FC } from "react";

import styles from "./LoadingSpinner.module.css";

const LoadingSpinner: FC = () => {
  //@TODO: implement a SrOnly "Loading" inner text
  return <div className={styles["loading-spinner"]} />;
};

export default LoadingSpinner;
