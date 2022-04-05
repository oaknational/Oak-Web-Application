import { FC, useContext } from "react";

import { UserStyleContext } from "../../context/UserStyleContext";

import styles from "./Card.module.css";

const Card: FC = ({ children }) => {
  const userStyleContext = useContext(UserStyleContext);

  return (
    <div className={styles[`card--${userStyleContext.user}`]}>{children}</div>
  );
};

export default Card;
