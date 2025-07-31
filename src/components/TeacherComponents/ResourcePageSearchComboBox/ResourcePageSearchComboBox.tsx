import React, { useEffect, useId, useRef } from "react";
import {
  ComboBoxStateOptions,
  useComboBoxState,
} from "@react-stately/combobox";
import { useFilter } from "@react-aria/i18n";
import { useComboBox } from "react-aria";
import {
  OakColorToken,
  OakFlex,
  OakJauntyAngleLabel,
  OakTextInput,
} from "@oaknational/oak-components";

import { Popover } from "@/components/SharedComponents/Popover";
import { ListBox } from "@/components/SharedComponents/ListBox";
import { School } from "@/components/TeacherComponents/ResourcePageSchoolPicker";

// Reuse the ListBox and Popover from your component library. See below for details.

const ResourcePageSearchComboBox = <T extends School>(
  props: ComboBoxStateOptions<T> & {
    hasError?: boolean;
    required?: boolean;
    errorId?: string;
    withHomeschool: boolean;
    label: string;
  },
) => {
  // Setup filter function and state.
  const { contains } = useFilter({ sensitivity: "base" });
  const state = useComboBoxState({ ...props, defaultFilter: contains });
  const { hasError = false, required } = props;
  // Setup refs and get props for child elements.
  const inputRef = useRef(null);
  const listBoxRef = useRef(null);
  const popoverRef = useRef(null);
  const { inputValue } = state;

  useEffect(() => {
    if (inputValue.length > 0 && !state.selectedItem && state.isFocused) {
      state.open();
    }
  }, [inputValue, state]);

  const { inputProps, listBoxProps, labelProps } = useComboBox(
    {
      ...props,
      inputRef,
      listBoxRef,
      popoverRef,
    },
    state,
  );

  labelProps.id = useId();
  const id = useId();
  const labelId = useId();

  let labelBackground: OakColorToken;

  if (state.isFocused) {
    labelBackground = "blue";
  } else if (hasError) {
    labelBackground = "red";
  } else {
    labelBackground = "lemon";
  }

  return (
    <OakFlex $width={"100%"} $position={"relative"} $display={"inline-block"}>
      <OakFlex $width={"100%"} $position={"relative"} ref={inputRef}>
        <OakJauntyAngleLabel
          label={props.label + (props.required ? " (required)" : "")}
          $color={state.isFocused || hasError ? "white" : "black"}
          htmlFor={id}
          as="label"
          id={labelId}
          $font={"heading-7"}
          $background={labelBackground}
          $zIndex="in-front"
          $position="absolute"
          $top={"-20px"}
          $left={"5px"}
          $borderRadius="border-radius-square"
        />

        <OakTextInput
          {...inputProps}
          value={String(inputProps.value)}
          id={id}
          aria-labelledby={labelId}
          data-testid={"search-combobox-input"}
          placeholder={
            props.withHomeschool
              ? "Type school name, postcode, or ‘homeschool’"
              : "Type school name or postcode"
          }
          aria-describedby={props.errorId ? props.errorId : undefined}
          required={required}
          aria-invalid={hasError}
          defaultValue={props.defaultInputValue}
          wrapperWidth={"100%"}
          $pv="inner-padding-none"
          $height="all-spacing-10"
          color="black"
        />
      </OakFlex>

      {state.isOpen && (
        <Popover
          popoverRef={popoverRef}
          isOpen={state.isOpen}
          onClose={() => state.close}
          focusOn={false}
        >
          <ListBox {...listBoxProps} listBoxRef={listBoxRef} state={state} />
        </Popover>
      )}
    </OakFlex>
  );
};

export default ResourcePageSearchComboBox;
