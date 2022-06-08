import { FC } from "react";
import styled, { css } from "styled-components";

import { OakColorName } from "../../styles/theme";
import getColorByLocation from "../../styles/themeHelpers/getColorByLocation";
import getFontFamily from "../../styles/themeHelpers/getFontFamily";

export type CheckboxConfig = {
  default: {
    color: OakColorName;
  };
  disabled: {
    color: OakColorName;
  };
};

const CheckboxLabel = styled.label<{ disabled: boolean }>`
  cursor: ${(props) => !props.disabled && "pointer"};
  display: flex;
  align-items: center;
  font-family: ${getFontFamily("ui")};
  color: ${getColorByLocation(({ theme }) => theme.checkbox.default.color)};
  ${(props) =>
    props.disabled &&
    css`
      color: ${getColorByLocation(({ theme }) => theme.checkbox.disabled.color)};
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

const VisualCheckbox = styled.svg``;

const Checkmark = styled.path<{ checked: boolean }>`
  opacity: ${(props) => (props.checked ? "1" : "0")};
  transition: all 0.1s linear;
  fill: currentcolor;

  @media screen and (-ms-high-contrast: active) {
    fill: ${(props) => (props.checked ? "highlight" : "windowText")};
  }
`;

const CheckmarkBox = styled.rect`
  stroke: currentcolor;

  @media screen and (-ms-high-contrast: active) {
    stroke: windowText;
  }
`;

const CheckboxLabelText = styled.span`
  margin-left: 8px;
  margin-right: 16px;
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
    <CheckboxLabel htmlFor={id} onClick={() => select} disabled={disabled}>
      <ScreenReaderCheckbox
        type="checkbox"
        id={id}
        onChange={select}
        checked={checked}
        disabled={disabled}
      />
      <VisualCheckbox
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        {/*  the background */}
        <rect
          x="0.5"
          y="0.5"
          width="23"
          height="23"
          rx="3.5"
          fill="transparent"
        />

        {/* the checkmark */}
        <Checkmark
          d="M10.0664 16.8233C10.3008 17.0589 10.6992 17.0589 10.9336 16.8233L17.8242 9.8966C18.0586 9.66099 18.0586 9.26047 17.8242 9.02487L16.9805 8.1767C16.7461 7.9411 16.3711 7.9411 16.1367 8.1767L10.5117 13.8312L7.86328 11.1924C7.62891 10.9568 7.25391 10.9568 7.01953 11.1924L6.17578 12.0406C5.94141 12.2762 5.94141 12.6767 6.17578 12.9123L10.0664 16.8233Z"
          checked={checked}
        />
        {/*  the border */}
        <CheckmarkBox x="0.5" y="0.5" width="23" height="23" rx="3.5" />
      </VisualCheckbox>
      {labelText && <CheckboxLabelText>{labelText}</CheckboxLabelText>}
    </CheckboxLabel>
  );
};

export default Checkbox;
