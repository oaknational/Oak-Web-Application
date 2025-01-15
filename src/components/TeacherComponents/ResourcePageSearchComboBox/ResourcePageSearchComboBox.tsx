import React, { useEffect, useId, useRef } from "react";
import {
  ComboBoxStateOptions,
  useComboBoxState,
} from "@react-stately/combobox";
import { useFilter } from "@react-aria/i18n";
import { useComboBox } from "react-aria";
import { OakFlex, OakSpan } from "@oaknational/oak-components";

import { Popover } from "@/components/SharedComponents/Popover";
import { ListBox } from "@/components/SharedComponents/ListBox";
import {
  RotatedInputLabel,
  StyledInput,
} from "@/components/SharedComponents/Input/Input";
import { DropdownFocusUnderline } from "@/components/GenericPagesComponents/Select/Select";
import { School } from "@/components/TeacherComponents/ResourcePageSchoolPicker";
import { OakColorName } from "@/styles/theme/types";
import BoxBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BoxBorders";

// Reuse the ListBox and Popover from your component library. See below for details.

const ResourcePageSearchComboBox = <T extends School>(
  props: ComboBoxStateOptions<T> & {
    hasError?: boolean;
    required?: boolean;
    errorId?: string;
    withHomeschool: boolean;
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

  let labelBackground: OakColorName;

  if (state.isFocused) {
    labelBackground = "blue";
  } else if (hasError) {
    labelBackground = "red";
  } else {
    labelBackground = "lemon";
  }

  return (
    <OakFlex $width={"100%"} $position={"relative"} $display={"inline-block"}>
      <OakFlex $width={"100%"} $position={"relative"}>
        <BoxBorders gapPosition="rightTop" />
        <OakFlex $position={"absolute"}>
          <RotatedInputLabel
            {...labelProps}
            aria-hidden="true"
            color={state.isFocused || hasError ? "white" : "black"}
            htmlFor={id}
            id={labelId}
            $font={"heading-7"}
            background={labelBackground}
          >
            {required ? (
              <OakSpan>
                {props.label}{" "}
                <OakSpan $font={"heading-light-7"}>(required)</OakSpan>
              </OakSpan>
            ) : (
              props.label
            )}
          </RotatedInputLabel>
        </OakFlex>

        <StyledInput
          {...inputProps}
          ref={inputRef}
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
        />
        <DropdownFocusUnderline
          isFocusVisible={state.isFocused}
          aria-hidden="true"
          name={"underline-1"}
          $font={"body-3"}
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
