import { forwardRef, MouseEventHandler, useState } from "react";
import styled from "styled-components";
import { useFocusRing } from "react-aria";

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
    content: "";
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    border: ${(props) => (props.isFocused ? `solid 4px #ffe555` : "none")};
    box-shadow: ${(props) =>
      props.isFocused ? `0px 0px 0px 5px #575757` : "none"};
    border-radius: 4px;
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
    const { isFocusVisible, focusProps } = useFocusRing();

    return (
      <BoxWithFocusState
        $pv={8}
        $width={"fit-content"}
        isFocused={isFocusVisible}
      >
        <StyledButton
          {...focusProps}
          onMouseOver={() => setTextUnderline(true)}
          onMouseLeave={() => setTextUnderline(false)}
          ref={ref}
          {...htmlButtonProps}
          $color={"navy"}
          onClick={onClick}
          $font={"heading-7"}
          aria-label={label}
          aria-expanded={isExpanded}
          $ph={8}
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
