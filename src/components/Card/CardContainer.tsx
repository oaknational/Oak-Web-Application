import { FC } from "react";

import styles from "./CardContainer.module.css";

const CardContainer: FC = ({ children }) => {
  return <div className={styles.cardContainer}>{children}</div>;
};

export default CardContainer;
