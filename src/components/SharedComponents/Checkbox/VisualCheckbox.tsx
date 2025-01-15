import { FC } from "react";
import styled from "styled-components";
import { OakIcon } from "@oaknational/oak-components";

import type { CheckboxVariant } from "./Checkbox";

import position, { PositionProps } from "@/styles/utils/position";
import { ZIndex, parseZIndex } from "@/styles/utils/zIndex";
import getColorByName from "@/styles/themeHelpers/getColorByName";

type VisualCheckboxProps = {
  checked: boolean;
  hasError?: boolean;
  variant?: CheckboxVariant;
  slim?: boolean;
  zIndex?: ZIndex;
};

type VisualCheckboxWrapper = {
  checked: boolean;
  hasError?: boolean;
  variant?: CheckboxVariant;
  slim?: boolean;
  zIndex?: ZIndex;
} & PositionProps;

const getBorderColor = (props: VisualCheckboxProps) => {
  if (props.hasError) {
    return getColorByName("red");
  } else if (props.checked) {
    return getColorByName("grey50");
  } else {
    return getColorByName("grey50");
  }
};

const VisualCheckboxWrapper = styled.span<VisualCheckboxWrapper>`
  position: ${(props) =>
    props?.variant === "withoutLabel" ? "absolute" : "relative"};

  left: ${(props) =>
    props?.variant === "withoutLabel" && !props.slim
      ? "12px"
      : props?.variant === "withoutLabel" && props.slim
        ? "85%"
        : "initial"};

  top: ${(props) =>
    props?.variant === "withoutLabel" && !props.slim
      ? "12px"
      : props?.variant === "withoutLabel" && props.slim
        ? "50%"
        : "initial"};

  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  min-width: 28px;
  height: 28px;
  border-style: solid;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${(props) => getBorderColor(props)};
  background-color: ${(props) =>
    props.checked ? getColorByName("black") : getColorByName("white")};
  ${position}
  z-index: ${(props) => (props.zIndex ? parseZIndex(props.zIndex) : 1)};
`;

const VisualCheckbox: FC<VisualCheckboxProps> = (props) => {
  return (
    <VisualCheckboxWrapper
      checked={props.checked}
      variant={props.variant}
      data-testid="visual-checkbox"
      hasError={props.hasError}
      slim={props.slim}
      zIndex={props.zIndex}
    >
      {props.checked && (
        <OakIcon
          iconName={"tick"}
          $colorFilter={"white"}
          $width={"all-spacing-5"}
          $height={"all-spacing-5"}
          data-testid="tick-icon"
        />
      )}
    </VisualCheckboxWrapper>
  );
};

export default VisualCheckbox;
