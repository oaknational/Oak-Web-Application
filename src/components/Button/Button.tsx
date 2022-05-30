import { FC, MouseEventHandler } from "react";
import styled from "styled-components";

import UnstyledButton from "../UnstyledButton";

import button, {
  ButtonStylesProps,
  getButtonStylesProps,
} from "./button.styles";
import ButtonInner from "./ButtonInner";
import {
  CommonButtonProps,
  defaultButtonProps,
  HTMLButtonProps,
} from "./common";

const StyledButton = styled(UnstyledButton)<ButtonStylesProps>`
  ${button}
`;

export type ButtonProps = CommonButtonProps & {
  onClick: MouseEventHandler<HTMLButtonElement>;
  htmlButtonProps?: HTMLButtonProps;
};

const Button: FC<ButtonProps> = (props) => {
  const {
    onClick,
    label,
    icon,
    "aria-label": ariaLabel,
    htmlButtonProps = {},
    ...spacingProps
  } = props;

  const { size, variant, iconPosition } = getButtonStylesProps(props);

  return (
    <StyledButton
      {...htmlButtonProps}
      title={htmlButtonProps.title || ariaLabel || label}
      aria-label={ariaLabel || label}
      onClick={onClick}
      size={size}
      variant={variant}
      iconPosition={iconPosition}
      {...spacingProps}
    >
      <ButtonInner
        label={label}
        icon={icon}
        iconPosition={iconPosition}
        size={size}
      />
    </StyledButton>
  );
};

Button.defaultProps = defaultButtonProps;

export default Button;
