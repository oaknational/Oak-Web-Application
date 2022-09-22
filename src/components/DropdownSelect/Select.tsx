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
import ellipsis from "../../styles/ellipsis";

import { Popover } from "./Popover";
import { ListBox } from "./ListBox";
import BoxBorders from "../SpriteSheet/BrushSvgs/BoxBorders";
import { RotatedInputLabel } from "../Input/Input";
import getColorByName from "../../styles/themeHelpers/getColorByName";

export { Item } from "react-stately";

export type SelectItem = {
  value: string;
  label: string;
};

type SelectProps = {
  name: string;
  label: string;
  items: SelectItem[];
  onSelectionChange: (value: string) => void;
  showLabel?: boolean;
  placeholder?: string;
  icon?: IconName;
  children: ReactNode;
  myRef: Ref<HTMLButtonElement>;
  containerProps?: FlexProps;
  "aria-invalid"?: boolean;
};

// export const SelectContainer = (props: FlexProps) => (
//   <Flex {...props} $flexDirection={"column"} $position={"relative"} />
// );

const SelectContainer = styled(Flex)`
  &:focus-within ${RotatedInputLabel} {
    background: ${getColorByName("teachersHighlight")};
    color: ${getColorByName("white")};
  }
`;

interface SelectButtonProps {
  isOpen?: boolean;
  isFocusVisible?: boolean;
  isPlaceholder?: boolean;
}

const selectButtonStyles = css<SelectButtonProps>`
  color: ${getColorByLocation(({ theme }) => theme.input.states.default.text)};
  height: ${(props) => props.theme.input.height};

  /** padding-left hack to account for border-width change to avoid content shift on select-span */
  padding-left: ${(props) =>
    props.isFocusVisible || props.isOpen ? "11px" : "12px"};
  padding-right: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  text-align: left;
  font-size: 16px;
  margin-top: 20px;
  outline: none;
  ${(props) =>
    props.isPlaceholder &&
    css`
      color: ${getColorByLocation(
        ({ theme }) => theme.input.states.default.placeholder
      )};
    `}
`;
export const SelectButton = styled(UnstyledButton)<SelectButtonProps>`
  ${selectButtonStyles}
`;
const NativeSelect = styled.select`
  ${selectButtonStyles}
`;

const Label = styled.label<{ visuallyHidden: boolean }>`
  display: block;
  text-align: left;
  font-family: ${getFontFamily("body")};
  font-size: ${(props) => props.theme.input.fontSize};
  ${(props) => props.visuallyHidden && srOnly}
`;

const SelectInner = styled(Flex)`
  max-width: calc(100% - 20px);
`;
/**
 * Contains either the selected value or the placeholder if no value is
 * selected
 */
const SelectSpan = styled.span`
  ${ellipsis}
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
    <SelectContainer
      $flexDirection={"column"}
      $position={"relative"}
      {...containerProps}
    >
      <BoxBorders hideBottom={state.isOpen} />
      <Flex $position={"absolute"}>
        <RotatedInputLabel background={"pastelTurqoise"} color={"black"}>
          {props.label}
        </RotatedInputLabel>
      </Flex>
      <Label {...labelProps} visuallyHidden={!showLabel}>
        {props.label}
      </Label>
      {shouldRenderNativeSelect ? (
        <NativeSelect
          // Having to ignore due to inconsistent ref types
          // eslint-disable-next-line
          // @ts-ignore
          ref={ref}
          aria-labelledby={labelProps.id}
          aria-describedby={props["aria-describedby"]}
          aria-invalid={props["aria-invalid"]}
          isPlaceholder={!state.selectedItem}
          onChange={(e) => state.setSelectedKey(e.target.value)}
        >
          <option value="">{props.placeholder}</option>
          {items.map((item) => (
            <option value={item.value}>{item.label}</option>
          ))}
        </NativeSelect>
      ) : (
        <>
          <HiddenSelect
            state={state}
            triggerRef={ref}
            label={props.label || props.placeholder}
            aria-describedby={props["aria-describedby"]}
            aria-invalid={props["aria-invalid"]}
            name={props.name}
          />
          <SelectButton
            {...mergeProps(buttonProps, focusProps)}
            ref={ref}
            isOpen={state.isOpen}
            isFocusVisible={isFocusVisible}
            isPlaceholder={!state.selectedItem}
          >
            <SelectInner $alignItems={"center"}>
              {props.icon && <Icon $mr={8} name={props.icon} />}
              <SelectSpan
                data-testid={"select-span"}
                title={props.placeholder}
                {...valueProps}
              >
                {state.selectedItem
                  ? state.selectedItem.rendered
                  : props.placeholder}
              </SelectSpan>
            </SelectInner>
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
