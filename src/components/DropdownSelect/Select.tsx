import { ReactNode, Ref } from "react";
import styled from "styled-components";
import type { AriaSelectProps } from "@react-types/select";
import { useObjectRef } from "@react-aria/utils";
import { useSelectState } from "react-stately";
import {
  useSelect,
  HiddenSelect,
  useButton,
  mergeProps,
  useFocusRing,
} from "react-aria";

import Flex, { FlexProps } from "../Flex";
import Icon, { IconName } from "../Icon";
import getColorByLocation from "../../styles/themeHelpers/getColorByLocation";
import UnstyledButton from "../UnstyledButton";
import getFontFamily from "../../styles/themeHelpers/getFontFamily";
import { srOnly } from "../ScreenReaderOnly";

import { Popover } from "./Popover";
import { ListBox } from "./ListBox";

export { Item } from "react-stately";

interface ButtonProps {
  isOpen?: boolean;
  isFocusVisible?: boolean;
}

type SelectProps = {
  name: string;
  label: string;
  showLabel?: boolean;
  placeholder?: string;
  icon?: IconName;
  children: ReactNode;
  myRef: Ref<HTMLButtonElement>;
  containerProps?: FlexProps;
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
  padding-left: 12px;
  padding-right: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  text-align: left;
  font-size: 16px;
`;

const Label = styled.label<{ visuallyHidden: boolean }>`
  display: block;
  text-align: left;
  font-family: ${getFontFamily("body")};
  font-size: ${(props) => props.theme.input.fontSize};
  ${(props) => props.visuallyHidden && srOnly}
`;

const SelectedOrPlaceholder = styled.span<{ isPlaceholder: boolean }>`
  color: ${(props) =>
    props.isPlaceholder
      ? getColorByLocation(
          ({ theme }) => theme.input.states.default.placeholder
        )
      : getColorByLocation(({ theme }) => theme.input.states.default.text)};
`;

export function Select<T extends object>(
  props: AriaSelectProps<T> & SelectProps
) {
  const { myRef, showLabel, containerProps } = props;
  // Create state based on the incoming props
  const state = useSelectState(props);
  const ref = useObjectRef(myRef);

  // Get props for child elements from useSelect
  const { labelProps, triggerProps, valueProps, menuProps } = useSelect(
    props,
    state,
    ref
  );

  // Get props for the button based on the trigger props from useSelect
  const { buttonProps } = useButton(triggerProps, ref);

  const { focusProps, isFocusVisible } = useFocusRing();

  return (
    <Flex {...containerProps} flexDirection={"column"} position={"relative"}>
      <Label {...labelProps} visuallyHidden={!showLabel}>
        {props.label}
      </Label>
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
          <SelectedOrPlaceholder
            data-testid={"select-span"}
            isPlaceholder={!state.selectedItem}
            {...valueProps}
          >
            {state.selectedItem
              ? state.selectedItem.rendered
              : props.placeholder}
          </SelectedOrPlaceholder>
        </Flex>
        <Icon name={"ChevronDown"} />
      </Button>
      {state.isOpen && (
        <Popover isOpen={state.isOpen} onClose={state.close}>
          <ListBox {...menuProps} state={state} />
        </Popover>
      )}
    </Flex>
  );
}
