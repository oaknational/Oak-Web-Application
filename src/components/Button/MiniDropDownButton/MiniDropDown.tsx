import { forwardRef, MouseEventHandler, useState } from "react";
import styled from "styled-components";
import { useFocusWithin } from "react-aria";

import { CommonButtonProps, HTMLButtonProps } from "../common";

import MiniDropDownInner from "./MiniDropDownInner";

import UnstyledButton, {
  UnstyledButtonProps,
} from "@/components/UnstyledButton";
import { ResponsiveValues } from "@/styles/utils/responsive";
import typography, { FontVariant } from "@/styles/utils/typography";
import { IconName } from "@/components/Icon";
import color from "@/styles/utils/color";
import { OakColorName } from "@/styles/theme";
import Box from "@/components/Box";

const StyledButton = styled(UnstyledButton)<
  UnstyledButtonProps & { $color?: OakColorName }
>`
  display: flex;
  align-items: center;
  outline: none;
  ${typography}
  ${color}
`;

const BoxWithFocusState = styled(Box)<{ isFocused: boolean }>`
  position: relative;

  &::before {
    z-index: -100;
    content: "";
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    border: ${(props) => (props.isFocused ? `solid 4px #ffe555` : "none")};
    border-radius: 4px;
    box-shadow: ${(props) =>
      props.isFocused ? `0px 0px 0px 5px #575757` : "none"};
  }
`;

type MiniDropDownProps = CommonButtonProps & {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  $font?: ResponsiveValues<FontVariant>;
  title?: string;
  isCurrent?: boolean;
  icon: IconName;
  isSelected?: boolean;
  ariaLabel?: string;
  htmlButtonProps?: HTMLButtonProps;
  isExpanded: boolean;
};

const MiniDropDown = forwardRef<HTMLButtonElement, MiniDropDownProps>(
  (props, ref) => {
    const { onClick, icon, label, htmlButtonProps, isExpanded } = props;
    const [textUnderline, setTextUnderline] = useState<boolean>(false);
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const { focusWithinProps } = useFocusWithin({
      onFocusWithinChange: setIsFocused,
    });
    return (
      <BoxWithFocusState
        $width={"fit-content"}
        $height={40}
        isFocused={isFocused}
      >
        <StyledButton
          {...focusWithinProps}
          onMouseOver={() => setTextUnderline(true)}
          onMouseLeave={() => setTextUnderline(false)}
          ref={ref}
          {...htmlButtonProps}
          $color={"navy"}
          onClick={onClick}
          $font={"heading-7"}
          aria-label={label}
          aria-expanded={isExpanded}
        >
          <MiniDropDownInner
            icon={icon}
            label={label}
            isHovered={textUnderline}
            isExpanded={isExpanded}
          />
        </StyledButton>
      </BoxWithFocusState>
    );
  },
);

export default MiniDropDown;
