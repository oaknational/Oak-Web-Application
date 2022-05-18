import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  FC,
  MouseEventHandler,
} from "react";

import UnstyledButton from "../UnstyledButton";

import IconButtonInner, { IconButtonInnerProps } from "./IconButtonInner";

type IconButtonProps = IconButtonInnerProps & {
  onClick: MouseEventHandler<HTMLButtonElement>;
  "aria-label": string;
  disabled?: boolean;
  htmlButtonProps?: Omit<
    DetailedHTMLProps<
      ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >,
    "ref" | "onClick" | "disabled"
  >;
};

const IconButton: FC<IconButtonProps> = (props) => {
  const {
    variant,
    size,
    icon,
    iconColorOverride,
    "aria-label": ariaLabel,
    disabled,
    onClick,
    htmlButtonProps = {},
  } = props;

  return (
    <UnstyledButton
      {...htmlButtonProps}
      onClick={onClick}
      title={htmlButtonProps.title || ariaLabel}
      aria-label={ariaLabel}
      disabled={disabled}
    >
      <IconButtonInner
        icon={icon}
        size={size}
        variant={variant}
        iconColorOverride={iconColorOverride}
      />
    </UnstyledButton>
  );
};

export default IconButton;
