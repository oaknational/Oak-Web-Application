import { FC } from "react";
import clsx from "clsx";

import Icon, { IconName } from "../Icon";
import {
  buttonIconSizeMap,
  ButtonSize,
  ButtonVariant,
  DEFAULT_BUTTON_SIZE,
  DEFAULT_BUTTON_VARIANT,
} from "../Button/Button";
import UnstyledButtonOrLink, {
  UnstyledButtonOrLinkProps,
} from "../UnstyledButtonOrLink";
import { IconColorOverride } from "../../styles/themes/types";

import styles from "./IconButton.module.css";

type IconButtonProps = UnstyledButtonOrLinkProps & {
  variant?: ButtonVariant;
  icon: IconName;
  "aria-label": string;
  size?: ButtonSize;
  iconColorOverride?: IconColorOverride;
};

const IconButton: FC<IconButtonProps> = (props) => {
  const {
    variant = DEFAULT_BUTTON_VARIANT,
    size = DEFAULT_BUTTON_SIZE,
    icon,
    title,
    className,
    iconColorOverride,
    "aria-label": ariaLabel,
    ...buttonOrLinkProps
  } = props;

  return (
    <UnstyledButtonOrLink
      {...buttonOrLinkProps}
      title={title || ariaLabel}
      aria-label={ariaLabel}
      className={clsx(
        className,
        styles.iconButton,
        styles[variant],
        styles[size]
      )}
    >
      <Icon
        name={icon}
        size={buttonIconSizeMap[size]}
        color={iconColorOverride}
      />
    </UnstyledButtonOrLink>
  );
};

export default IconButton;
