import { FC } from "react";
import clsx from "clsx";

import { ButtonOrLinkProps, ButtonOrLink } from "../ButtonOrLink/ButtonOrLink";
import Icon, { IconName } from "../Icon";
import {
  buttonIconSizeMap,
  ButtonSize,
  ButtonVariant,
  DEFAULT_BUTTON_SIZE,
  DEFAULT_BUTTON_VARIANT,
} from "../Button/Button";

import styles from "./IconButton.module.css";

type IconButtonProps = ButtonOrLinkProps & {
  variant?: ButtonVariant;
  icon: IconName;
  "aria-label": string;
  size?: ButtonSize;
};

const IconButton: FC<IconButtonProps> = (props) => {
  const {
    variant = DEFAULT_BUTTON_VARIANT,
    size = DEFAULT_BUTTON_SIZE,
    icon,
    ...buttonOrLinkProps
  } = props;

  return (
    <ButtonOrLink
      {...buttonOrLinkProps}
      className={clsx(styles.iconButton, styles[variant], styles[size])}
    >
      <Icon name={icon} size={buttonIconSizeMap[size]} />
    </ButtonOrLink>
  );
};

export default IconButton;
