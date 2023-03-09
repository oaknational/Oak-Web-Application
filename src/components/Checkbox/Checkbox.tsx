import { FC, forwardRef, ChangeEvent } from "react";
import styled, { css } from "styled-components";
import { RefCallBack } from "react-hook-form";

import { OakColorName } from "../../styles/theme";
import spacing, { SpacingProps } from "../../styles/utils/spacing";
import getColorByLocation from "../../styles/themeHelpers/getColorByLocation";
import getColorByName from "../../styles/themeHelpers/getColorByName";
import getFontFamily from "../../styles/themeHelpers/getFontFamily";
import FocusUnderline from "../OakLink/FocusUnderline";
import FieldError from "../FormFields/FieldError";

import VisualCheckbox from "./VisualCheckbox";

export type CheckboxConfig = {
  default: {
    color: OakColorName;
  };
  disabled: {
    color: OakColorName;
  };
};

export type CheckboxVariant = "cardCheckbox" | "terms";

export type CheckboxProps = {
  labelText?: string;
  id: string;
  name: string;
  checked: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  required?: boolean;
  error?: string;
  onChange: (checked: ChangeEvent<HTMLInputElement>) => void;
  children?: React.ReactNode;
  variant?: CheckboxVariant;
  inputRef?: RefCallBack;
  onBlur?: () => void;
} & SpacingProps;

type CheckboxLabelProps = {
  disabled: boolean;
  checked: boolean;
  variant?: CheckboxVariant;
  hasError?: boolean;
} & SpacingProps;

const checkboxFocusStyles = css`
  input[type="checkbox"]:focus + span,
  input[type="checkbox"]:active + span {
    border-color: ${getColorByName("black")};

    &::before {
      content: "";
      position: absolute;
      width: 34px;
      height: 34px;
      left: -5px;
      right: 0;
      border: solid 3px ${getColorByName("teachersYellow")};
      border-radius: 3px;
    }
  }

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

  input[type="checkbox"]:active ~ ${FocusUnderline} {
    display: block;
  }

  input[type="checkbox"]:focus ~ div,
  input[type="checkbox"]:active ~ div {
    border: solid 4px ${getColorByName("teachersYellow")};
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

const CheckboxLabel = styled.label<CheckboxLabelProps>`
  position: relative;
  display: ${(props) =>
    props.variant !== "cardCheckbox" ? "flex" : "initial"};
  align-items: center;
  margin-bottom: 16px;
  cursor: ${(props) => !props.disabled && "pointer"};
  font-family: ${getFontFamily("ui")};
  color: ${getColorByLocation(({ theme }) => theme.checkbox.default.color)};
  width: 100%;
  ${(props) =>
    props.disabled &&
    css`
      color: ${getColorByLocation(
        ({ theme }) => theme.checkbox.disabled.color
      )};
    `}

  ${checkboxFocusStyles}
  ${checkboxHoverStyles}
  ${spacing}
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
  margin-right: 16px;
  font-weight: 400;
`;

const Checkbox: FC<CheckboxProps> = forwardRef<HTMLInputElement, CheckboxProps>(
  (props) => {
    const {
      labelText,
      checked = false,
      disabled = false,
      onChange,
      id,
      name,
      ariaLabel,
      required = false,
      error,
      children,
      variant,
      inputRef,
      onBlur,
      ...spacingProps
    } = props;

    const errorId = `${id}-error`;

    return (
      <>
        <CheckboxLabel
          htmlFor={id}
          checked={checked}
          disabled={disabled}
          variant={variant}
          hasError={Boolean(error)}
          {...spacingProps}
        >
          <ScreenReaderCheckbox
            type="checkbox"
            id={id}
            value={id}
            name={name}
            onChange={(e) => onChange(e)}
            checked={checked}
            disabled={disabled}
            aria-label={ariaLabel ? ariaLabel : labelText}
            required={required}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            ref={inputRef}
            onBlur={onBlur}
          />
          <VisualCheckbox
            checked={checked}
            variant={variant}
            hasError={Boolean(error)}
          />
          {/* card checkbox */}
          {!labelText && variant === "cardCheckbox" && children}
          {/* basic label checkbox */}

          {labelText && variant !== "cardCheckbox" && (
            <>
              <CheckboxLabelText>{labelText}</CheckboxLabelText>{" "}
              <FocusUnderline $color={"teachersYellow"} />
            </>
          )}
        </CheckboxLabel>
        {variant !== "terms" && (
          <FieldError id={errorId} withoutMarginBottom>
            {error}
          </FieldError>
        )}
      </>
    );
  }
);

export default Checkbox;
