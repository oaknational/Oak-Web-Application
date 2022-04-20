import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  FC,
  MouseEventHandler,
} from "react";
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

export type ButtonProps = DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  variant?: ButtonVariant;
  href?: string;
  label: string;
  icon?: IconName;
  background?: Color;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};
const Button: FC<ButtonProps> = (props) => {
  const {
    variant = "rounded",
    onClick,
    href,
    label,
    icon,
    background,
    ...buttonHtmlProps
  } = props;

  const buttonInner = (
    <button
      onClick={onClick}
      className={clsx(styles.button, styles[`background--${background}`], {
        [`${styles["variant--rounded"]}`]: variant === "rounded",
      })}
      {...buttonHtmlProps}
    >
      <span className={styles["button-label"]}>{label}</span>
      {icon && (
        <span className={styles["button-icon-wrapper"]}>
          <Icon name={icon} size={16} />
        </span>
      )}
    </button>
  );

  if (href) {
    return (
      <Link href={href} passHref>
        {buttonInner}
      </Link>
    );
  }

  return buttonInner;
};

export default Button;
