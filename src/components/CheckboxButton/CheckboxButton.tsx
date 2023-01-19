import { FC } from "react";
import styled, { css } from "styled-components";

import { OakColorName } from "../../styles/theme";
import getColorByLocation from "../../styles/themeHelpers/getColorByLocation";
import getFontFamily from "../../styles/themeHelpers/getFontFamily";
import BrushBorders from "../SpriteSheet/BrushSvgs/BrushBorders";

export type CheckboxButtonConfig = {
  default: {
    color: OakColorName;
  };
  disabled: {
    color: OakColorName;
  };
  searchFilter: {
    default: {
      color: OakColorName;
      background: OakColorName;
    };
    disabled: {
      color: OakColorName;
    };
  };
};

const CheckboxLabel = styled.label<{ disabled: boolean; checked: boolean }>`
  position: relative;
  cursor: ${(props) => !props.disabled && "pointer"};
  display: flex;
  align-items: center;
  font-family: ${getFontFamily("ui")};
  font-weight: 600;
  margin: 8px;
  color: ${getColorByLocation(
    ({ theme }) => theme.checkbox.searchFilter.default.color
  )};
  background-color: ${getColorByLocation(
    ({ theme }) => theme.checkbox.searchFilter.default.background
  )};
  ${(props) =>
    props.disabled &&
    css`
      color: ${getColorByLocation(
        ({ theme }) => theme.checkbox.searchFilter.disabled.color
      )};
    `}
  ${(props) =>
    props.checked &&
    css`
      color: ${getColorByLocation(
        ({ theme }) => theme.checkbox.searchFilter.disabled.color
      )};
      background-color: transparent;
      text-decoration: underline;
    `}

  input[type="checkbox"]:focus + svg {
    // TODO: add focus ring component to replace this
    outline: 4px auto -webkit-focus-ring-color;
    outline-offset: 4px;
  }
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

const CheckboxLabelText = styled.span`
  margin-left: 8px;
  margin-right: 8px;
`;

type CheckboxProps = {
  labelText: string;
  id: string;
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
};

const CheckboxButton: FC<CheckboxProps> = (props) => {
  const { labelText, checked, disabled = false, onChange, id } = props;

  const select = () => {
    if (!disabled) onChange();
  };

  return (
    <div>
      <CheckboxLabel
        htmlFor={id}
        onClick={() => select}
        disabled={disabled}
        checked={checked}
      >
        {!checked && <BrushBorders color={"pastelTurquoise"} />}
        <ScreenReaderCheckbox
          type="checkbox"
          id={id}
          onChange={select}
          checked={checked}
          disabled={disabled}
        />

        {labelText && <CheckboxLabelText>{labelText}</CheckboxLabelText>}
      </CheckboxLabel>
    </div>
  );
};

export default CheckboxButton;
