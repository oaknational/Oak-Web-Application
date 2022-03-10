import { FC } from "react";
import Link from "next/link";
import clsx from "clsx";

import styles from "./Button.module.css";
import Icon, { IconName } from "./Icon";

type Color = "primary";
type ButtonVariant = "primary" | "text-link";

export type ButtonProps = {
  variant?: ButtonVariant;
  href?: string;
  label: string;
  icon?: IconName;
  background?: Color;
};
const Button: FC<ButtonProps> = (props) => {
  const { variant = "primary", href, label, icon, background } = props;

  if (href) {
    return (
      <Link href={href} passHref>
        <button
          className={clsx(styles.button, {
            [`${styles["variant--primary"]}`]: variant === "primary",
            [`${styles["background--primary"]}`]: background === "primary",
          })}
        >
          <span className={styles["button-label"]}>{label}</span>
          {icon && (
            <span className={styles["button-icon-wrapper"]}>
              <Icon name={icon} size={16} />
            </span>
          )}
        </button>
      </Link>
    );
  }

  return null;
};

export default Button;
