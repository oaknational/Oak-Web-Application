import { useComboBoxState } from "@react-stately/combobox";
import { useRef } from "react";
import { CollectionChildren, Key } from "@react-types/shared";
import { useComboBox, useFilter } from "react-aria";
import { Item } from "react-stately";
import {
  OakBox,
  OakFlex,
  OakJauntyAngleLabel,
  OakTextInput,
} from "@oaknational/oak-components";

import { Popover } from "@/components/SharedComponents/Popover";
import { ListBox } from "@/components/SharedComponents/ListBox";

export const AutocompleteItem = Item;

/*
 * Waiting for the following components to be in oak-components
 *
 *  - <Popover />
 *  - <ListBox />
 *  - <Input />
 */

type AutocompleteProps = {
  inputProps: {
    id: string;
    label: string;
    error?: string;
    placeholder?: string;
    name?: string;
  };
  value?: string;
  onChange: (value: string, textValue: string) => void;
  onInputChange?: (value: string) => void;
  isControlled?: boolean;
  children: CollectionChildren<HTMLDivElement>;
};
const Autocomplete = (props: AutocompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const listBoxRef = useRef(null);
  const popoverRef = useRef(null);
  const { contains } = useFilter({ sensitivity: "base" });

  const onSelectionChange = (key: Key | null) => {
    if (key === null) return;
    const textValue = state.collection.getItem(key);
    if (textValue) {
      props.onChange(String(key), textValue.textValue);
    }
  };

  const onInputChange = (key: string) => {
    props.onInputChange?.(String(key));
  };

  const state = useComboBoxState({
    ...props,
    defaultFilter: contains,
    onSelectionChange: onSelectionChange,
    onInputChange: onInputChange,
    [props.isControlled ? "inputValue" : "defaultInputValue"]: props.value,
    [props.isControlled ? "items" : "children"]:
      props.children as Iterable<HTMLDivElement>,
  });

  const { inputProps, listBoxProps } = useComboBox(
    {
      ...props,
      inputRef,
      listBoxRef,
      popoverRef,
      label: props.inputProps.label,
    },
    state,
  );

  const isOpen = state.isOpen;

  return (
    <OakBox $width={"100%"}>
      <OakFlex $width={"100%"} $position={"relative"} ref={inputRef}>
        <OakJauntyAngleLabel
          label={props.inputProps.label}
          $color={state.isFocused || props.inputProps.error ? "white" : "black"}
          htmlFor={inputProps.id}
          id={"autocomplete-label"}
          $font={"heading-7"}
          $background={
            props.inputProps.error ? "red" : state.isFocused ? "blue" : "lemon"
          }
          $zIndex="in-front"
          $position="absolute"
          $top={"-20px"}
          $left={"5px"}
          $borderRadius="border-radius-square"
          data-testid="jaunty-label"
        />
        <OakTextInput
          {...inputProps}
          value={String(inputProps.value)}
          id={inputProps.id}
          aria-labelledby={"autocomplete-label"}
          data-testid={"autocomplete-input"}
          placeholder={props.inputProps.placeholder}
          aria-describedby={undefined}
          required={true}
          aria-invalid={props.inputProps.error ? "true" : undefined}
          defaultValue={undefined}
          wrapperWidth={"100%"}
          $pv="inner-padding-none"
          $height="all-spacing-10"
          color="black"
        />
      </OakFlex>
      {isOpen && (
        <OakBox $position={"relative"}>
          <Popover
            popoverRef={popoverRef}
            isOpen={isOpen}
            onClose={() => state.close}
            focusOn={false}
          >
            <ListBox
              {...listBoxProps}
              data-testid="listbox"
              listBoxRef={listBoxRef}
              state={state}
            />
          </Popover>
        </OakBox>
      )}
    </OakBox>
  );
};

export default Autocomplete;
