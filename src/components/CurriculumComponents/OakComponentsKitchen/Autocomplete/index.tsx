import { useComboBoxState } from "@react-stately/combobox";
import { ComponentProps, useRef } from "react";
import { CollectionChildren, Key } from "@react-types/shared";
import { useComboBox, useFilter } from "react-aria";
import { Item } from "react-stately";
import { OakBox } from "@oaknational/oak-components";

import { Popover } from "@/components/SharedComponents/Popover";
import { ListBox } from "@/components/SharedComponents/ListBox";
import Input from "@/components/SharedComponents/Input";

export const AutocompleteItem = Item;

/*
 * Waiting for the following components to be in oak-components
 *
 *  - <Popover />
 *  - <ListBox />
 *  - <Input />
 */

type AutocompleteProps = {
  inputProps: ComponentProps<typeof Input>;
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
      <Input
        {...props.inputProps}
        {...inputProps}
        data-testid="input"
        placeholder={props.inputProps.placeholder}
        value={String(inputProps.value)}
        $mb={0}
        ref={inputRef}
      />
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
