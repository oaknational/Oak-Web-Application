import clsx from "clsx";
import { ButtonHTMLAttributes, DetailedHTMLProps, FC } from "react";

import styles from "./UnstyledButton.module.css";

type UnstyledButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;
const UnstyledButton: FC<UnstyledButtonProps> = (props) => {
  const { className } = props;
  return (
    <button {...props} className={clsx(className, styles.unstyledButton)} />
  );
};

export default UnstyledButton;
