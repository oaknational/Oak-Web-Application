import { FC } from "react";

import styles from "./VisuallyHidden.module.css";

const VisuallyHidden: FC = (props) => {
  return <div {...props} className={styles.visuallyHidden} />;
};

export default VisuallyHidden;
