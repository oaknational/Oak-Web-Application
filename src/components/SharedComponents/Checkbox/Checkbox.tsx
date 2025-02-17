import { FC, ChangeEvent, ReactNode } from "react";
import styled, { css } from "styled-components";
import { RefCallBack } from "react-hook-form";
import { OakSpan } from "@oaknational/oak-components";

import VisualCheckbox from "./VisualCheckbox";

import { OakColorName } from "@/styles/theme";
import spacing, { SpacingProps } from "@/styles/utils/spacing";
import getColorByLocation from "@/styles/themeHelpers/getColorByLocation";
import getColorByName from "@/styles/themeHelpers/getColorByName";
import getFontFamily from "@/styles/themeHelpers/getFontFamily";
import FocusUnderline from "@/components/SharedComponents/FocusUnderline";
import FieldError from "@/components/SharedComponents/FieldError";
import { ZIndex } from "@/styles/utils/zIndex";

export type CheckboxConfig = {
  default: {
    color: OakColorName;
  };
  disabled: {
    color: OakColorName;
  };
};

export type CheckboxVariant = "withoutLabel" | "withLabel";

export type CheckboxProps = {
  labelText?: ReactNode | string;
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
  hasError?: boolean;
  labelFontWeight?: 400 | 600;
  slim?: boolean;
  zIndex?: ZIndex;
  autoFocus?: boolean;
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
      border: solid 3px ${getColorByName("lemon")};
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
    border: solid 4px ${getColorByName("lemon")};
    box-shadow: 0 0 0 3px ${getColorByName("grey50")};
    border-radius: 4px;
  }
`;

const checkboxHoverStyles = css`
  input[type="checkbox"]:hover + span {
    background-color: ${getColorByName("white")};

    &::after {
      content: "";
      position: absolute;
      display: block;
      width: 16px;
      height: 16px;
      border-radius: 2px;
      background-color: ${getColorByName("black")};
    }
  }
`;

const CheckboxLabel = styled.label<CheckboxLabelProps>`
  position: relative;
  display: ${(props) =>
    props.variant !== "withoutLabel" ? "flex" : "initial"};
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
        ({ theme }) => theme.checkbox.disabled.color,
      )};
    `}

  ${checkboxFocusStyles}
  ${(props) => !props.checked && checkboxHoverStyles}
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

const CheckboxLabelText = styled(OakSpan)<{ fontWeight: 400 | 600 }>`
  margin-left: 8px;
  margin-right: 16px;
  font-weight: ${(props) => props.fontWeight};
`;

const Checkbox: FC<CheckboxProps> = (props) => {
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
    hasError = false,
    children,
    variant,
    inputRef,
    onBlur,
    slim,
    autoFocus,
    zIndex,
    labelFontWeight,
    ...spacingProps
  } = props;

  const errorId = `${id}-error`;

  return (
    <>
      <CheckboxLabel
        checked={checked}
        disabled={disabled}
        variant={variant}
        hasError={hasError}
        {...spacingProps}
      >
        <ScreenReaderCheckbox
          type="checkbox"
          id={id}
          value={id}
          name={name}
          onChange={onChange}
          checked={checked}
          disabled={disabled}
          aria-label={ariaLabel ? ariaLabel : labelText}
          required={required}
          aria-invalid={hasError}
          aria-describedby={error ? errorId : undefined}
          ref={inputRef}
          onBlur={onBlur}
          autoFocus={autoFocus}
        />
        <VisualCheckbox
          checked={checked}
          variant={variant}
          hasError={hasError}
          slim={slim}
          zIndex={zIndex}
        />
        {/* card checkbox */}
        {!labelText && variant === "withoutLabel" && children}
        {/* basic label checkbox */}

        {labelText && variant !== "withoutLabel" && (
          <>
            <CheckboxLabelText fontWeight={labelFontWeight ?? 400}>
              {labelText}
            </CheckboxLabelText>{" "}
            <FocusUnderline $color={"lemon"} />
          </>
        )}
      </CheckboxLabel>
      {variant !== "withLabel" && (
        <FieldError id={errorId} withoutMarginBottom>
          {error}
        </FieldError>
      )}
    </>
  );
};

export default Checkbox;
