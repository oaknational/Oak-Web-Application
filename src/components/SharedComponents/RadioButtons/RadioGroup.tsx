import React, { createContext, FC, useId } from "react";
import { useRadioGroup, AriaRadioGroupProps } from "react-aria";
import { RadioGroupState, useRadioGroupState } from "react-stately";

import FieldError from "@/components/SharedComponents/FieldError";

export const RadioContext = createContext<RadioGroupState | null>(null);

/**
 * Radio groups allow users to select a single item from a list of mutually exclusive options .
 * Radio group consists of a set of radio buttons, and a label. Each radio includes a label and a visual selection indicator. A single radio button within the group can be selected at a time. Users may click or touch a radio button to select it, or use the Tab key to navigate to the group, the arrow keys to navigate within the group, and the Space key to select an option.
 * ## Usage
 *
 * Add value={selected} onChange={setSelected} to radio group and 'Radio' component as children for each button.
 */
const RadioGroup: FC<
  AriaRadioGroupProps & { children: React.ReactNode; hasError?: boolean }
> = (props) => {
  const {
    children,
    label,
    description,
    errorMessage: errorMessageCandidate,
    hasError,
  } = props;
  const state = useRadioGroupState(props);
  const { radioGroupProps, labelProps, descriptionProps, errorMessageProps } =
    useRadioGroup(props, state);

  // Type predicate to make sure errorMessage is a React.ReactNode and not a validation function.
  // Can we get rid of this?
  const isErrorMessage = (
    e: typeof errorMessageCandidate,
  ): e is React.ReactNode => typeof e !== "function";
  const errorMessage = isErrorMessage(errorMessageCandidate)
    ? errorMessageCandidate
    : undefined;

  radioGroupProps.id = useId();
  return (
    <div {...radioGroupProps} aria-describedby={undefined}>
      <span {...labelProps}>{label}</span>
      <RadioContext.Provider value={state}>{children}</RadioContext.Provider>
      {description && (
        <div {...descriptionProps} style={{ fontSize: 12 }}>
          {description}
        </div>
      )}
      {errorMessage && hasError && (
        <FieldError id={"radio-group-error"} {...errorMessageProps}>
          {errorMessage}
        </FieldError>
      )}
    </div>
  );
};

export default RadioGroup;
