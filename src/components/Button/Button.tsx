import { FC } from "react";
import clsx from "clsx";

import Icon, { IconName } from "../Icon";
import { ButtonOrLink, ButtonOrLinkProps } from "../ButtonOrLink/ButtonOrLink";

import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "secondary" | "tertiary";
type IconPosition = "leading" | "trailing";
export type ButtonSize = "small" | "large";
export const buttonIconSizeMap: Record<ButtonSize, number> = {
  small: 16,
  large: 24,
};
export const DEFAULT_BUTTON_SIZE: ButtonSize = "small";
export const DEFAULT_BUTTON_VARIANT: ButtonVariant = "primary";

export type ButtonProps = ButtonOrLinkProps & {
  variant?: ButtonVariant;
  label: string;
  size?: ButtonSize;
  icon?: IconName;
  iconPosition?: IconPosition;
};
const Button: FC<ButtonProps> = (props) => {
  const {
    variant = DEFAULT_BUTTON_VARIANT,
    size = DEFAULT_BUTTON_SIZE,
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
          <Icon name={icon} size={buttonIconSizeMap[size]} />
        </span>
      )}
      <span className={styles.labelSpan}>{label}</span>
    </ButtonOrLink>
  );
};

export default Button;
