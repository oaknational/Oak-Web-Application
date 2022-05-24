import {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  FC,
  MouseEventHandler,
} from "react";
import styled from "styled-components";

import UnstyledButton from "../UnstyledButton";

import { outermostElementStyles } from "./common";
import IconButtonInner, { IconButtonInnerProps } from "./IconButtonInner";

const StyledButton = styled(UnstyledButton)`
  ${outermostElementStyles}
`;

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
    <StyledButton
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
    </StyledButton>
  );
};

export default IconButton;
