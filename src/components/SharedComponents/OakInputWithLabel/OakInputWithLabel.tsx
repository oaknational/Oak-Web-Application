import {
  OakFlex,
  OakBox,
  OakFieldError,
  OakJauntyAngleLabel,
  OakTextInput,
  OakColorToken,
} from "@oaknational/oak-components";
import { useState } from "react";
import { RefCallBack } from "react-hook-form";

export const getFormLabelBackground = (
  error: string | undefined,
  focusState: boolean | undefined,
  backgroundColor: OakColorToken | undefined,
) => {
  if (error) {
    return "red";
  }
  if (focusState) {
    return "blue";
  }
  if (backgroundColor) {
    return backgroundColor;
  }
  return "lemon";
};

export const OakInputWithLabel = ({
  error,
  id,
  autocomplete,
  label,
  onChange,
  onBlur,
  ref,
  required,
  placeholder = "",
  name,
  defaultValue,
  labelBackground,
  value,
}: {
  label: string;
  required: boolean;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  ref?: RefCallBack;
  placeholder?: string;
  id: string;
  autocomplete?: string;
  name: string;
  defaultValue?: string;
  labelBackground?: OakColorToken;
  value?: string;
}) => {
  const [hasFocus, setHasFocus] = useState(false);

  return (
    <OakFlex $flexDirection="column" $width="100%">
      {error && (
        <OakBox id={error} role="alert" $pb={["inner-padding-xl"]}>
          <OakFieldError>{error}</OakFieldError>
        </OakBox>
      )}
      <OakFlex $position="relative" $flexDirection="column" ref={ref}>
        <OakJauntyAngleLabel
          label={label + (required === true ? " (required)" : "")}
          $color={!!error || hasFocus ? "white" : "black"}
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
          data-testid="text-input"
          placeholder={placeholder}
          onChange={onChange}
          onFocus={() => setHasFocus(true)}
          onBlur={(e) => {
            onBlur?.(e);
            setHasFocus(false);
          }}
          $pv="inner-padding-none"
          wrapperWidth="100%"
          $height="all-spacing-10"
          autoComplete={autocomplete}
          name={name}
          defaultValue={defaultValue}
          value={value}
        />
      </OakFlex>
    </OakFlex>
  );
};
