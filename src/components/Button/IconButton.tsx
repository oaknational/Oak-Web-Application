import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  forwardRef,
  MouseEventHandler,
} from "react";
import styled from "styled-components";

import { CommonIconButtonProps } from "./common";
import iconButtonStyles, {
  getIconButtonStylesProps,
  IconButtonStylesProps,
} from "./iconButton.styles";
import IconButtonInner from "./IconButtonInner";

import UnstyledButton from "@/components/UnstyledButton";

const StyledButton = styled(UnstyledButton)<IconButtonStylesProps>`
  transform: rotate(${(props) => props.rotate}deg);
  transition: transform 200ms;
  ${iconButtonStyles};
`;

export type IconButtonProps = CommonIconButtonProps & {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  "aria-label": string;
  disabled?: boolean;
  rotate?: number;
  children?: React.ReactNode;
  htmlButtonProps?: Omit<
    DetailedHTMLProps<
      ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >,
    "ref" | "onClick" | "disabled"
  >;
};

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (props, ref) => {
    const {
      icon,
      rotate,
      iconColorOverride,
      "aria-label": ariaLabel,
      disabled,
      onClick,
      children,
      htmlButtonProps = {},
      iconAnimateTo,
      ...styleProps
    } = props;

    const { size, variant, background } = getIconButtonStylesProps(props);

    return (
      <StyledButton
        ref={ref}
        {...htmlButtonProps}
        onClick={onClick}
        rotate={rotate}
        title={htmlButtonProps.title || ariaLabel}
        aria-label={ariaLabel}
        disabled={disabled}
        size={size}
        background={background}
        variant={variant}
        {...styleProps}
      >
        <IconButtonInner
          icon={icon}
          size={size}
          variant={variant}
          background={background}
          iconColorOverride={iconColorOverride}
          iconAnimateTo={iconAnimateTo}
        />
        {children}
      </StyledButton>
    );
  }
);

export default IconButton;
