import { FC } from "react";

import styles from "./ButtonGroup.module.css";

/**
 * @todo run time check that all children are Button or IconButton components
 */
const ButtonGroup: FC = (props) => {
  const { children } = props;

  return <div className={styles.buttonGroup}>{children}</div>;
};

export default ButtonGroup;
