import { FC } from "react";
import styled from "styled-components";

import position, { PositionProps } from "../../styles/utils/position";
import getColorByName from "../../styles/themeHelpers/getColorByName";
import Icon from "../Icon";

type VisualCheckboxProps = {
  checked: boolean;
  type?: string;
};

type VisualCheckboxWrapper = {
  checked: boolean;
  type?: string;
} & PositionProps;

const VisualCheckboxWrapper = styled.span<VisualCheckboxWrapper>`
  position: ${(props) =>
    props?.type === "cardCheckbox" ? "absolute" : "relative"};
  left: ${(props) => (props?.type === "cardCheckbox" ? "8px" : "initial")};
  top: ${(props) => (props?.type === "cardCheckbox" ? "8px" : "initial")};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  min-width: 28px;
  height: 28px;
  border-style: solid;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${(props) =>
    props.checked
      ? getColorByName("teachersHighlight")
      : getColorByName("oakGrey3")};
  background-color: ${(props) =>
    props.checked
      ? getColorByName("teachersHighlight")
      : getColorByName("white")};
  ${position}
`;

const VisualCheckbox: FC<VisualCheckboxProps> = (props) => {
  return (
    <VisualCheckboxWrapper checked={props.checked} type={props.type}>
      {props.checked && <Icon name={"Tick"} $color={"white"} size={20} />}
    </VisualCheckboxWrapper>
  );
};

export default VisualCheckbox;
