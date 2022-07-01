import * as React from "react";
import styled from "styled-components";
import type { AriaSelectProps } from "@react-types/select";
import { useSelectState } from "react-stately";
import {
  useSelect,
  HiddenSelect,
  useButton,
  mergeProps,
  useFocusRing,
} from "react-aria";

import Flex from "../Flex";
import Icon, { IconName } from "../Icon";
import getColorByLocation from "../../styles/themeHelpers/getColorByLocation";
import UnstyledButton from "../UnstyledButton";
import getFontFamily from "../../styles/themeHelpers/getFontFamily";

import { Popover } from "./Popover";
import { ListBox } from "./ListBox";

export { Item } from "react-stately";

interface ButtonProps {
  isOpen?: boolean;
  isFocusVisible?: boolean;
}

type SelectProps = {
  placeholder: string;
  name: string;
  icon?: IconName;
};

const Button = styled(UnstyledButton)<ButtonProps>`
  color: ${getColorByLocation(({ theme }) => theme.input.states.default.text)};
  height: ${(props) => props.theme.input.height};
  border-radius: ${(props) => props.theme.input.borderRadius};
  border: 1px solid;
  border-color: ${(props) =>
    props.isFocusVisible
      ? getColorByLocation(({ theme }) => theme.input.states.active.border)
      : getColorByLocation(({ theme }) => theme.input.states.default.border)};
  background: ${(props) =>
    props.isOpen
      ? getColorByLocation(({ theme }) => theme.input.states.active.background)
      : getColorByLocation(
          ({ theme }) => theme.input.states.default.background
        )};
  padding: 6px 2px 6px 8px;
  margin-top: 6px;
  outline: none;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  text-align: left;
  font-size: 16px;

  &:focus {
    outline: 1px dotted #212121;
    outline: 5px auto -webkit-focus-ring-color;
  }
`;

export const Label = styled.label`
  display: block;
  text-align: left;
  font-family: ${getFontFamily("body")};
  font-size: 12px;
`;

export function Select<T extends object>(
  props: AriaSelectProps<T> & SelectProps
) {
  // Create state based on the incoming props
  const state = useSelectState(props);

  // Get props for child elements from useSelect
  const ref = React.useRef(null);
  const { labelProps, triggerProps, valueProps, menuProps } = useSelect(
    props,
    state,
    ref
  );

  // Get props for the button based on the trigger props from useSelect
  const { buttonProps } = useButton(triggerProps, ref);

  const { focusProps, isFocusVisible } = useFocusRing();

  return (
    <Flex flexDirection={"column"} position={"relative"}>
      <Label {...labelProps}>{props.label}</Label>
      <HiddenSelect
        state={state}
        triggerRef={ref}
        label={props.label || props.placeholder}
        name={props.name}
      />
      <Button
        {...mergeProps(buttonProps, focusProps)}
        ref={ref}
        isOpen={state.isOpen}
        isFocusVisible={isFocusVisible}
      >
        <Flex alignItems={"center"}>
          {props.icon && <Icon mr={8} name={props.icon}></Icon>}
          <span data-testid={"select-span"} {...valueProps}>
            {state.selectedItem
              ? state.selectedItem.rendered
              : props.placeholder}
          </span>
        </Flex>
        <Icon name={"ChevronRight"}></Icon>
      </Button>
      {state.isOpen && (
        <Popover isOpen={state.isOpen} onClose={state.close}>
          <ListBox {...menuProps} state={state} />
        </Popover>
      )}
    </Flex>
  );
}
