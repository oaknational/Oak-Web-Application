import {
  OakFlex,
  OakBox,
  OakFieldError,
  OakJauntyAngleLabel,
  OakTextInput,
} from "@oaknational/oak-components";
import { useState } from "react";
import { RefCallBack } from "react-hook-form";

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
}) => {
  const [hasFocus, setHasFocus] = useState(false);

  return (
    <OakFlex
      $position="relative"
      $flexDirection="column"
      ref={ref}
      $width="100%"
    >
      {error && (
        <OakBox id={error} role="alert" $mv="space-between-s">
          <OakFieldError>{error}</OakFieldError>
        </OakBox>
      )}
      <OakJauntyAngleLabel
        label={label + (required ? " (required)" : "")}
        $color={!!error || hasFocus ? "white" : "black"}
        htmlFor={id}
        as="label"
        id={label + "-label"}
        $font={"heading-7"}
        $background={error ? "red" : hasFocus ? "blue" : "lemon"}
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
      />
    </OakFlex>
  );
};
