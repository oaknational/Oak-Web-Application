import React, { useId } from "react";
import { useButton, useComboBox, useFilter } from "react-aria";
import { Item, useComboBoxState } from "react-stately";

import { ListBox } from "../DropdownSelect/ListBox";
import { Popover } from "../DropdownSelect/Popover";
import Flex from "../Flex";
import ComboPopover from "./ComboPopover";

// Reuse the ListBox, Popover, and Button from your component library. See below for details.

function Button(props) {
  const ref = props.buttonRef;
  const { buttonProps } = useButton(props, ref);
  return (
    <button {...buttonProps} ref={ref} style={props.style}>
      {props.children}
    </button>
  );
}
const ComboBox = (props) => {
  // Setup filter function and state.
  const { contains } = useFilter({ sensitivity: "base" });

  //   console.log("containes", contains);
  const state = useComboBoxState({
    ...props,
    defaultFilter: contains,
  });

  // Setup refs and get props for child elements.
  const buttonRef = React.useRef(null);
  const inputRef = React.useRef(null);
  const listBoxRef = React.useRef(null);
  const popoverRef = React.useRef(null);

  //   console.log("popover:", popoverRef);

  const { buttonProps, inputProps, listBoxProps, labelProps } = useComboBox(
    {
      ...props,
      inputRef,
      buttonRef,
      listBoxRef,
      popoverRef,
    },
    state
  );

  // React.useId because: https://github.com/adobe/react-spectrum/issues/2438
  labelProps.id = useId();
  console.log(inputRef);

  return (
    <Flex $flexDirection={"column"} $position={"relative"}>
      <label {...labelProps}>{props.label}</label>
      <Flex $flexDirection={"column"} $position={"relative"}>
        <input
          {...inputProps}
          ref={inputRef}
          style={{
            height: 24,
            boxSizing: "border-box",
            marginRight: 0,
            fontSize: 16,
          }}
        />
        {/* <Button
          {...buttonProps}
          buttonRef={buttonRef}
          style={{
            height: 24,
            marginLeft: 0,
          }}
        >
          <span aria-hidden="true" style={{ padding: "0 2px" }}>
            ▼
          </span>
        </Button> */}
        {state.isOpen && (
          <Popover
            isOpen={state.isOpen}
            // state={state}
            // triggerRef={inputRef}
            // popoverRef={popoverRef}
            // isNonModal
            // placement="bottom start"
          >
            <ListBox {...listBoxProps} listBoxRef={listBoxRef} state={state} />
          </Popover>
        )}
      </Flex>
    </Flex>
  );
};

export default ComboBox;
