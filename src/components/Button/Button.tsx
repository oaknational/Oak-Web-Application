import { FC } from "react";
import clsx from "clsx";

import Icon, { IconName } from "../Icon";
import { ButtonOrLink, ButtonOrLinkProps } from "../ButtonOrLink/ButtonOrLink";

import styles from "./Button.module.css";

type ButtonVariant = "primary" | "secondary" | "tertiary";
type ButtonSize = "small" | "large";
type IconPosition = "leading" | "trailing";

export type ButtonProps = ButtonOrLinkProps & {
  variant?: ButtonVariant;
  label: string;
  size?: ButtonSize;
  icon?: IconName;
  iconPosition?: IconPosition;
};
const Button: FC<ButtonProps> = (props) => {
  const {
    variant = "primary",
    size = "large",
    label,
    icon,
    iconPosition = "leading",
    ...buttonOrLinkProps
  } = props;

  return (
    <ButtonOrLink
      {...buttonOrLinkProps}
      className={clsx(
        styles.button,
        styles[variant],
        styles[size],
        styles[`${iconPosition}Icon`]
      )}
    >
      {icon && (
        <span className={styles.iconWrapper}>
          <Icon name={icon} size={16} />
        </span>
      )}
      <span className={styles.labelSpan}>{label}</span>
    </ButtonOrLink>
  );
};

export default Button;
