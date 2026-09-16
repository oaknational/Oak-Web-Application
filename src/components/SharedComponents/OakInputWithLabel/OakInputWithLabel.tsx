import {
  OakFlex,
  OakBox,
  OakFieldError,
  OakJauntyAngleLabel,
  OakTextInput,
  OakUiRoleToken,
} from "@oaknational/oak-components";
import { useState } from "react";

export const getFormLabelBackground = (
  error: string | undefined,
  focusState: boolean | undefined,
  backgroundColor: OakUiRoleToken | undefined,
) => {
  if (error) {
    return "bg-error";
  }
  if (focusState) {
    return "bg-inverted";
  }
  if (backgroundColor) {
    return backgroundColor;
  }
  return "bg-decorative5-main";
};

export const OakInputWithLabel = ({
  error,
  id,
  autocomplete,
  label,
  onChange,
  onBlur,
  value,
  required,
  placeholder = "",
  name,
  defaultValue,
  labelBackground,
}: {
  label: string;
  required: boolean;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  value?: string;
  placeholder?: string;
  id: string;
  autocomplete?: string;
  name: string;
  defaultValue?: string;
  labelBackground?: OakUiRoleToken;
  // value?: string;
}) => {
  const [hasFocus, setHasFocus] = useState(false);
  const errorId = `${id}-error`;

  return (
    <OakFlex $flexDirection="column" $width="100%">
      {error && (
        <OakBox
          id={errorId}
          role="status"
          aria-live="assertive"
          $mb="spacing-20"
        >
          <OakFieldError>{error}</OakFieldError>
        </OakBox>
      )}
      <OakFlex $position="relative" $flexDirection="column">
        <OakJauntyAngleLabel
          label={label + (required === true ? " (required)" : "")}
          $color={!!error || hasFocus ? "text-inverted" : "text-primary"}
          htmlFor={id}
          as="label"
          id={label + "-label"}
          $font={"heading-7"}
          $background={getFormLabelBackground(error, hasFocus, labelBackground)}
          $zIndex="in-front"
          $position="absolute"
          $top={"-20px"}
          $left={"5px"}
          $borderRadius="border-radius-square"
          data-testid="jaunty-label"
        />
        <OakTextInput
          id={id}
          aria-describedby={error ? errorId : undefined}
          value={value}
          data-testid="text-input"
          placeholder={placeholder}
          onChange={onChange}
          onFocus={() => setHasFocus(true)}
          onBlur={(e) => {
            onBlur?.(e);
            setHasFocus(false);
          }}
          $pv="spacing-0"
          wrapperWidth="100%"
          $height="spacing-56"
          autoComplete={autocomplete}
          name={name}
          defaultValue={defaultValue}
        />
      </OakFlex>
    </OakFlex>
  );
};
