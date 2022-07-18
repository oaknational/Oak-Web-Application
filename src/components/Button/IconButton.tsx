import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  FC,
  MouseEventHandler,
} from "react";
import styled from "styled-components";

import UnstyledButton from "../UnstyledButton";

import { CommonIconButtonProps } from "./common";
import iconButtonStyles, {
  getIconButtonStylesProps,
  IconButtonStylesProps,
} from "./iconButton.styles";
import IconButtonInner from "./IconButtonInner";

const StyledButton = styled(UnstyledButton)<IconButtonStylesProps>`
  transform: rotate(${(props) => props.rotate}deg);
  transition: transform 200ms;
  ${iconButtonStyles};
`;

type IconButtonProps = CommonIconButtonProps & {
  onClick: MouseEventHandler<HTMLButtonElement>;
  "aria-label": string;
  disabled?: boolean;
  rotate?: number;
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
    icon,
    rotate,
    iconColorOverride,
    "aria-label": ariaLabel,
    disabled,
    onClick,
    htmlButtonProps = {},
    ...styleProps
  } = props;

  const { size, variant } = getIconButtonStylesProps(props);

  return (
    <StyledButton
      {...htmlButtonProps}
      onClick={onClick}
      rotate={rotate}
      title={htmlButtonProps.title || ariaLabel}
      aria-label={ariaLabel}
      disabled={disabled}
      size={size}
      variant={variant}
      {...styleProps}
    >
      <IconButtonInner
        icon={icon}
        size={size}
        variant={variant}
        iconColorOverride={iconColorOverride}
      />
    </StyledButton>
  );
};

export default IconButton;
