import React, { useEffect, useId, useRef } from "react";
import {
  ComboBoxStateOptions,
  useComboBoxState,
} from "@react-stately/combobox";
import { useFilter } from "@react-aria/i18n";
import { useComboBox } from "react-aria";

import { Popover } from "../DropdownSelect/Popover";
import { ListBox } from "../DropdownSelect/ListBox";
import BoxBorders from "../SpriteSheet/BrushSvgs/BoxBorders";
import Flex from "../Flex";
import { RotatedInputLabel, StyledInput } from "../Input/Input";
import { DropdownFocusUnderline } from "../DropdownSelect/Select";
import { School } from "../SchoolPicker/SchoolPicker";

// Reuse the ListBox and Popover from your component library. See below for details.

const SearchComboBox = <T extends School>(props: ComboBoxStateOptions<T>) => {
  // Setup filter function and state.
  const { contains } = useFilter({ sensitivity: "base" });
  const state = useComboBoxState({ ...props, defaultFilter: contains });

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
    state
  );

  labelProps.id = useId();
  const id = useId();
  const labelId = useId();

  return (
    <Flex $width={"100%"} $position={"relative"} $display={"inline-block"}>
      <Flex $width={"100%"} $position={"relative"}>
        <BoxBorders
          hideBottom={state.isOpen ? true : false}
          gapPosition="rightTop"
        />
        <Flex $position={"absolute"}>
          <RotatedInputLabel
            {...labelProps}
            aria-hidden="true"
            color={state.isFocused ? "white" : "black"}
            htmlFor={id}
            id={labelId}
            $font={"body-3"}
            background={
              state.isFocused ? "teachersHighlight" : "pastelTurquoise"
            }
          >
            {props.label}
          </RotatedInputLabel>
        </Flex>

        <StyledInput
          {...inputProps}
          ref={inputRef}
          value={String(inputProps.value)}
          id={id}
          aria-labelledby={labelId}
          data-testid={"search-autocomplete-input"}
          placeholder={"Search by name or postcode"}
          aria-describedby={undefined}
        />
        <DropdownFocusUnderline
          isFocusVisible={state.isFocused}
          aria-hidden="true"
          name={"Underline1"}
          $font={"body-3"}
        />
      </Flex>

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
    </Flex>
  );
};

export default SearchComboBox;
