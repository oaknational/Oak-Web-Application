import { forwardRef, MouseEventHandler } from "react";
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
  onClick?: MouseEventHandler<HTMLButtonElement>;
  htmlButtonProps?: HTMLButtonProps;
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const {
    onClick,
    label,
    icon,
    "aria-label": ariaLabel,
    htmlButtonProps = {},
    iconBackground,
    ...spacingProps
  } = props;

  const { size, variant, iconPosition, background } =
    getButtonStylesProps(props);

  return (
    <StyledButton
      ref={ref}
      {...htmlButtonProps}
      title={htmlButtonProps.title || ariaLabel || label}
      aria-label={ariaLabel || label}
      onClick={onClick}
      size={size}
      variant={variant}
      iconPosition={iconPosition}
      background={background}
      {...spacingProps}
    >
      <ButtonInner
        label={label}
        icon={icon}
        iconPosition={iconPosition}
        iconBackground={iconBackground}
        size={size}
        variant={variant}
        background={background}
      />
    </StyledButton>
  );
});

Button.defaultProps = defaultButtonProps;

export default Button;
