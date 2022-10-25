import { forwardRef, MouseEventHandler } from "react";
import styled from "styled-components";

import UnstyledButton, { UnstyledButtonProps } from "../UnstyledButton";

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

const StyledButton = styled(UnstyledButton)<
  ButtonStylesProps & UnstyledButtonProps
>`
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
    labelSuffixA11y,
    shouldHideLabel,
    icon,
    "aria-label": ariaLabel,
    htmlButtonProps = {},
    iconBackground,
    ...spacingProps
  } = props;

  const { size, variant, iconPosition, background } =
    getButtonStylesProps(props);

  const defaultTitle =
    ariaLabel || labelSuffixA11y ? `${label} ${labelSuffixA11y}` : "";

  return (
    <StyledButton
      ref={ref}
      {...htmlButtonProps}
      title={htmlButtonProps.title || defaultTitle}
      aria-label={ariaLabel}
      onClick={onClick}
      size={size}
      variant={variant}
      iconPosition={iconPosition}
      background={background}
      {...spacingProps}
    >
      <ButtonInner
        label={label}
        labelSuffixA11y={labelSuffixA11y}
        icon={icon}
        iconPosition={iconPosition}
        iconBackground={iconBackground}
        shouldHideLabel={shouldHideLabel}
        size={size}
        variant={variant}
        background={background}
      />
    </StyledButton>
  );
});

Button.defaultProps = defaultButtonProps;

export default Button;
