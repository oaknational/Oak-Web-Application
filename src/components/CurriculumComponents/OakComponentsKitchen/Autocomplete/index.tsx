import { useComboBoxState } from "@react-stately/combobox";
import { ComponentProps, Key, useRef } from "react";
import { CollectionChildren } from "@react-types/shared";
import { useComboBox, useFilter } from "react-aria";
import { Item } from "react-stately";
import { OakBox } from "@oaknational/oak-components";

import { Popover } from "@/components/SharedComponents/Popover";
import { ListBox } from "@/components/SharedComponents/ListBox";
import Input from "@/components/SharedComponents/Input";

export const AutocompleteItem = Item;

type AutocompleteProps = {
  inputProps: Omit<ComponentProps<typeof Input>, "value">;
  value?: string;
  onChange: (value: string) => void;
  onInputChange?: (value: string) => void;
  children: CollectionChildren<HTMLDivElement>;
};
const Autocomplete = (props: AutocompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const listBoxRef = useRef(null);
  const popoverRef = useRef(null);
  const { contains } = useFilter({ sensitivity: "base" });

  const onSelectionChange = (key: Key) => {
    props.onChange(String(key));
  };

  const onInputChange = (key: string) => {
    props.onInputChange?.(String(key));
  };

  const state = useComboBoxState({
    ...props,
    defaultFilter: contains,
    defaultInputValue: props.value,
    onSelectionChange: onSelectionChange,
    onInputChange: onInputChange,
    children: props.children,
  });

  const { inputProps, listBoxProps } = useComboBox(
    {
      ...props,
      inputRef,
      listBoxRef,
      popoverRef,
      label: props.inputProps.label,
      children: props.children,
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
