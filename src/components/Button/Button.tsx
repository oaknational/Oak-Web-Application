import { forwardRef, MouseEventHandler } from "react";
import styled from "styled-components";

import { ResponsiveValues } from "../../styles/utils/responsive";
import typography, { FontVariant } from "../../styles/utils/typography";
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
  ${typography}
`;

export type ButtonProps = CommonButtonProps & {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  htmlButtonProps?: HTMLButtonProps;
  $font?: ResponsiveValues<FontVariant>;
  disabled?: boolean;
  title?: string;
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const {
    onClick,
    label,
    labelSuffixA11y,
    shouldHideLabel,
    icon,
    subjectIcon,
    "aria-label": ariaLabel,
    htmlButtonProps = {},
    iconBackground,
    $font,
    disabled,
    title,
    ...spacingProps
  } = props;

  const { size, variant, $iconPosition, background } =
    getButtonStylesProps(props);

  const defaultTitle =
    ariaLabel ?? (labelSuffixA11y && `${label} ${labelSuffixA11y}`) ?? label;

  return (
    <StyledButton
      ref={ref}
      {...htmlButtonProps}
      title={title ?? htmlButtonProps.title ?? defaultTitle}
      aria-label={ariaLabel}
      onClick={disabled ? (e) => e.preventDefault() : onClick}
      size={size}
      variant={variant}
      $iconPosition={$iconPosition}
      background={background}
      aria-disabled={disabled}
      {...spacingProps}
    >
      <ButtonInner
        label={label}
        labelSuffixA11y={labelSuffixA11y}
        icon={icon}
        subjectIcon={subjectIcon}
        $iconPosition={$iconPosition}
        iconBackground={iconBackground}
        shouldHideLabel={shouldHideLabel}
        size={size}
        variant={variant}
        background={background}
        $font={$font}
        disabled={disabled}
      />
    </StyledButton>
  );
});

Button.defaultProps = defaultButtonProps;

export default Button;
