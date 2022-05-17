import { FC } from "react";

import Button, { ButtonProps } from "../Button";

import styles from "./CardButton.module.css";

interface CardButtonProps {
  href: string;
  label: string;
  buttonProps?: ButtonProps;
}
//
const CardButton: FC<CardButtonProps> = (props, buttonProps) => {
  return (
    <Button
      className={styles.cardButton}
      href={props.href}
      label={props.label}
      {...buttonProps}
    ></Button>
  );
};

export default CardButton;
