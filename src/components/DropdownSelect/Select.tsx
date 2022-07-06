import { ReactNode, Ref } from "react";
import styled, { css } from "styled-components";
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

export type SelectItem = {
  value: string;
  label: string;
};

type SelectProps = {
  name: string;
  label: string;
  items: SelectItem[];
  showLabel?: boolean;
  placeholder?: string;
  icon?: IconName;
  children: ReactNode;
  myRef: Ref<HTMLButtonElement>;
  containerProps?: FlexProps;
};

export const SelectContainer = (props: FlexProps) => (
  <Flex {...props} flexDirection={"column"} position={"relative"} />
);

interface SelectButtonProps {
  isOpen?: boolean;
  isFocusVisible?: boolean;
  isNativeSelect?: boolean;
}
export const SelectButton = styled(UnstyledButton)<SelectButtonProps>`
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
  ${(props) =>
    props.isNativeSelect &&
    css`
      color: ${getColorByLocation(
        ({ theme }) => theme.input.states.default.placeholder
      )};
    `}
`;

const NativeSelectPlaceholder = styled.option`
  color: ${getColorByLocation(
    ({ theme }) => theme.input.states.default.placeholder
  )};
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
    getColorByLocation(({ theme }) =>
      props.isPlaceholder
        ? theme.input.states.default.placeholder
        : theme.input.states.default.text
    )};
`;

export function Select<T extends object>(
  props: AriaSelectProps<T> & SelectProps
) {
  const { myRef, showLabel, containerProps, items } = props;
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

  // On tablets and phones, make use of native select components
  const shouldRenderNativeSelect =
    typeof window === "undefined"
      ? false
      : /Mobi|iP(hone|od|ad)|Android|BlackBerry/i.test(
          window.navigator.userAgent
        );

  return (
    <SelectContainer {...containerProps}>
      <Label {...labelProps} visuallyHidden={!showLabel}>
        {props.label}
      </Label>
      {shouldRenderNativeSelect ? (
        // Having to ignore due to inconsistent ref types
        // eslint-disable-next-line
        // @ts-ignore
        <SelectButton
          as="select"
          ref={ref}
          aria-labelledBy={labelProps.id}
          isNativeSelect
        >
          <NativeSelectPlaceholder value="" disabled selected>
            {props.placeholder}
          </NativeSelectPlaceholder>
          {items.map((item) => (
            <option value={item.value}>{item.label}</option>
          ))}
        </SelectButton>
      ) : (
        <>
          <HiddenSelect
            state={state}
            triggerRef={ref}
            label={props.label || props.placeholder}
            name={props.name}
          />
          <SelectButton
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
          </SelectButton>
          {state.isOpen && (
            <Popover isOpen={state.isOpen} onClose={state.close}>
              <ListBox {...menuProps} state={state} />
            </Popover>
          )}
        </>
      )}
    </SelectContainer>
  );
}
