import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  FC,
  MouseEventHandler,
} from "react";
import styled from "styled-components";

import UnstyledButton from "../UnstyledButton";

import ButtonInner, { ButtonInnerProps } from "./ButtonInner";
import { outermostElementStyles } from "./common";

const StyledButton = styled(UnstyledButton)`
  ${outermostElementStyles}
`;

export type ButtonProps = ButtonInnerProps & {
  onClick: MouseEventHandler<HTMLButtonElement>;
  "aria-label"?: string;
  htmlButtonProps?: Omit<
    DetailedHTMLProps<
      ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >,
    "ref"
  >;
};

const Button: FC<ButtonProps> = (props) => {
  const {
    onClick,
    variant,
    size,
    label,
    icon,
    iconPosition = "leading",
    "aria-label": ariaLabel,
    htmlButtonProps = {},
  } = props;

  return (
    <StyledButton
      {...htmlButtonProps}
      title={htmlButtonProps.title || ariaLabel || label}
      aria-label={ariaLabel || label}
      onClick={onClick}
    >
      <ButtonInner
        variant={variant}
        label={label}
        icon={icon}
        iconPosition={iconPosition}
        size={size}
      />
    </StyledButton>
  );
};

export default Button;
