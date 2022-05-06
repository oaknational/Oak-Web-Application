import clsx from "clsx";
import { FC } from "react";

import styles from "./Card.module.css";

interface CardProps {
  radius?: boolean;
  color?: "card-primary" | "card-secondary" | "card-tertiary";
}

const Card: FC<CardProps> = ({
  radius = true,
  color = `card-secondary`,
  children,
}) => {
  return (
    <div
      className={clsx(styles[color], {
        [`${styles["cardRadius"]}`]: radius,
      })}
    >
      {children}
    </div>
  );
};

export default Card;
