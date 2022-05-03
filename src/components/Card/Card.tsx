import { FC } from "react";

import styles from "./Card.module.css";

const Card: FC = ({ children }) => {
  return <div className={styles[`card-primary`]}>{children}</div>;
};

export default Card;
