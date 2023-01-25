import { FC } from "react";
import styled, { css } from "styled-components";

import { OakColorName } from "../../styles/theme";
import getColorByLocation from "../../styles/themeHelpers/getColorByLocation";
import getColorByName from "../../styles/themeHelpers/getColorByName";
import getFontFamily from "../../styles/themeHelpers/getFontFamily";
import Icon from "../Icon";
import FocusUnderline from "../OakLink/FocusUnderline";

export type CheckboxConfig = {
  default: {
    color: OakColorName;
  };
  disabled: {
    color: OakColorName;
  };
};

const checkboxFocusStyles = css`
  ${FocusUnderline} {
    display: none;
    position: absolute;
    right: 0;
    left: 0;
    bottom: -10px;
    height: 7px;
    filter: drop-shadow(1px 5px 0 rgb(0 0 0));
    width: calc(100% - 10px);
  }

  input[type="checkbox"]:focus ~ ${FocusUnderline} {
    display: block;
  }
`;

const checkboxHoverStyles = css`
  input[type="checkbox"]:hover + span {
    background-color: ${getColorByName("white")};
    border-color: ${getColorByName("oakGrey3")};

    &::after {
      content: "";
      position: absolute;
      display: block;
      width: 16px;
      height: 16px;
      border-radius: 2px;
      background-color: ${getColorByName("teachersHighlight")};
    }
  }
`;

const CheckboxLabel = styled.label<{ disabled: boolean; checked: boolean }>`
  position: relative;
  margin-bottom: 24px;
  cursor: ${(props) => !props.disabled && "pointer"};
  display: flex;
  align-items: center;
  font-family: ${getFontFamily("ui")};
  color: ${getColorByLocation(({ theme }) => theme.checkbox.default.color)};
  ${(props) =>
    props.disabled &&
    css`
      color: ${getColorByLocation(
        ({ theme }) => theme.checkbox.disabled.color
      )};
    `}

  ${checkboxFocusStyles}
  ${checkboxHoverStyles}
`;

const ScreenReaderCheckbox = styled.input.attrs({ type: "checkbox" })<{
  disabled: boolean;
}>`
  cursor: ${(props) => !props.disabled && "pointer"};
  position: absolute;
  width: 24px;
  height: 24px;
  opacity: 0;
`;

const VisualCheckbox = styled.span<{ checked: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
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
`;

const CheckboxLabelText = styled.span`
  margin-left: 8px;
  margin-right: 16px;
  font-weight: 400;
`;

type CheckboxProps = {
  labelText: string;
  id: string;
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
};

const Checkbox: FC<CheckboxProps> = (props) => {
  const { labelText, checked, disabled = false, onChange, id } = props;

  const select = () => {
    if (!disabled) onChange();
  };

  return (
    <CheckboxLabel
      htmlFor={id}
      onClick={() => select}
      checked={checked}
      disabled={disabled}
    >
      <ScreenReaderCheckbox
        type="checkbox"
        id={id}
        onChange={select}
        checked={checked}
        disabled={disabled}
      />
      <VisualCheckbox checked={checked}>
        {checked && <Icon name={"Tick"} $color={"white"} size={20} />}
      </VisualCheckbox>
      {labelText && <CheckboxLabelText>{labelText}</CheckboxLabelText>}
      <FocusUnderline $color={"teachersYellow"} />
    </CheckboxLabel>
  );
};

export default Checkbox;
