import { Ref, useId } from "react";
import styled, { css } from "styled-components";
import type { AriaSelectProps } from "@react-types/select";
import { useObjectRef } from "@react-aria/utils";
import { useSelectState } from "react-stately";
import { useSelect, useButton, mergeProps, useFocusRing } from "react-aria";

import Flex, { FlexProps } from "../Flex";
import Icon, { IconName } from "../Icon";
import getColorByLocation from "../../styles/themeHelpers/getColorByLocation";
import UnstyledButton from "../UnstyledButton";
import ellipsis from "../../styles/ellipsis";
import BoxBorders from "../SpriteSheet/BrushSvgs/BoxBorders";
import { InputFocusUnderline, RotatedInputLabel } from "../Input/Input";
import getColorByName from "../../styles/themeHelpers/getColorByName";

import { ListBox } from "./ListBox";
import { Popover } from "./Popover";

export { Item } from "react-stately";

export const DropdownFocusUnderline = styled(InputFocusUnderline)<{
  isFocusVisible: boolean;
}>`
  display: ${(props) => (props.isFocusVisible ? "inline" : "none")};
`;

export type SelectItem = {
  value: string;
  label: string;
};

type SelectProps = {
  name: string;
  label: string;
  items: SelectItem[];
  onSelectionChange: (value: string) => void;
  placeholder?: string;
  icon?: IconName;
  myRef: Ref<HTMLButtonElement>;
  containerProps?: FlexProps;
  "aria-invalid"?: boolean;
};

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
  padding-left: 12px;
  padding-right: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  text-align: left;
  font-size: 16px;
  background: transparent;
  border: none;
  padding-top: 3px;
  margin-top: 10px;
  outline: none;
  ${(props) =>
    props.isPlaceholder &&
    css`
      font-size: 14px;
      color: ${getColorByLocation(
        ({ theme }) => theme.input.states.default.placeholder
      )};
    `}
`;
export const SelectButton = styled(UnstyledButton)<SelectButtonProps>`
  ${selectButtonStyles}
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
  const { myRef, containerProps } = props;

  // Create state based on the incoming props
  const state = useSelectState(props);
  const ref = useObjectRef(myRef);

  // Get props for child elements from useSelect
  const { labelProps, triggerProps, menuProps } = useSelect(props, state, ref);

  // React.useId because: https://github.com/adobe/react-spectrum/issues/2438
  labelProps.id = useId();

  // Get props for the button based on the trigger props from useSelect
  const { buttonProps } = useButton(triggerProps, ref);

  const { focusProps, isFocusVisible } = useFocusRing();

  // unique id for map key
  const id = useId();
  const valueId = `${id}-value`;
  const buttonId = `${id}-button`;

  return (
    <SelectContainer
      $flexDirection={"column"}
      $position={"relative"}
      $background="white"
      {...containerProps}
    >
      <BoxBorders gapPosition="rightTop" hideBottom={state.isOpen} />
      <DropdownFocusUnderline
        isFocusVisible={isFocusVisible}
        aria-hidden="true"
        name={"underline-1"}
        $font={"body-3"}
      />
      <Flex $position={"absolute"}>
        <RotatedInputLabel
          background={props.onFocus ? "teachersPastelBlue" : "pastelTurquoise"}
          color={"black"}
          $font={"body-3"}
          {...labelProps}
        >
          {props.label}
        </RotatedInputLabel>
      </Flex>

      <>
        <SelectButton
          {...mergeProps(buttonProps, focusProps)}
          aria-labelledby={labelProps.id}
          aria-describedby={props["aria-describedby"]}
          aria-invalid={props["aria-invalid"]}
          ref={ref}
          isOpen={state.isOpen}
          isFocusVisible={isFocusVisible}
          isPlaceholder={!state.selectedItem}
          id={buttonId}
        >
          <SelectInner $alignItems={"center"}>
            {props.icon && <Icon $mr={8} name={props.icon} />}
            <SelectSpan
              id={valueId}
              data-testid={"select-span"}
              title={props.placeholder}
            >
              {state.selectedItem
                ? state.selectedItem.rendered
                : props.placeholder}
            </SelectSpan>
          </SelectInner>
          <Icon
            $color="black"
            name={state.isOpen ? "chevron-up" : "chevron-down"}
          />
        </SelectButton>
        {state.isOpen && (
          <Popover isOpen={state.isOpen} onClose={state.close}>
            <ListBox {...menuProps} state={state} />
          </Popover>
        )}
      </>
    </SelectContainer>
  );
}
