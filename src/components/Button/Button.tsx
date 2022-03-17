import { FC } from "react";
import Link from "next/link";
import clsx from "clsx";

import Icon, { IconName } from "../Icon";

import styles from "./Button.module.css";

type Color =
  | "teachers-primary"
  | "teachers-secondary"
  | "pupils-primary"
  | "pupils-secondary";

type ButtonVariant = "rounded" | "text-link";

export type ButtonProps = {
  variant?: ButtonVariant;
  href?: string;
  label: string;
  icon?: IconName;
  background?: Color;
};
const Button: FC<ButtonProps> = (props) => {
  const { variant = "rounded", href, label, icon, background } = props;

  if (href) {
    return (
      <Link href={href} passHref>
        <button
          className={clsx(styles.button, styles[`background--${background}`], {
            [`${styles["variant--rounded"]}`]: variant === "rounded",
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
