import { Ref, useId } from "react";
import styled, { css } from "styled-components";
import type { AriaSelectProps } from "@react-types/select";
import { useObjectRef } from "@react-aria/utils";
import { useSelectState } from "react-stately";
import { useSelect, useButton, mergeProps, useFocusRing } from "react-aria";
import {
  OakSpan,
  OakIcon,
  OakIconName,
  OakFlex,
  OakFlexProps,
} from "@oaknational/oak-components";

import UnstyledButton from "@/components/SharedComponents/UnstyledButton";
import {
  InputFocusUnderline,
  RotatedInputLabel,
} from "@/components/SharedComponents/Input/Input";
import { ListBox } from "@/components/SharedComponents/ListBox";
import { Popover } from "@/components/SharedComponents/Popover";
import getColorByName from "@/styles/themeHelpers/getColorByName";
import ellipsis from "@/styles/ellipsis";
import getColorByLocation from "@/styles/themeHelpers/getColorByLocation";
import BoxBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BoxBorders";

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
  icon?: OakIconName;
  myRef: Ref<HTMLButtonElement>;
  containerProps?: OakFlexProps;
  "aria-invalid"?: boolean;
  selectedValue?: string;
};

const SelectContainer = styled(OakFlex)`
  &:focus-within ${RotatedInputLabel} {
    background: ${getColorByName("blue")};
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
  padding-left: 16px;
  padding-right: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  text-align: left;
  font-size: 16px;
  background: transparent;
  border: none;
  outline: none;
  ${(props) =>
    props.isPlaceholder &&
    css`
      font-size: 14px;
      color: ${getColorByLocation(
        ({ theme }) => theme.input.states.default.placeholder,
      )};
    `}
`;
export const SelectButton = styled(UnstyledButton)<SelectButtonProps>`
  ${selectButtonStyles}
`;

const SelectInner = styled(OakFlex)`
  max-width: calc(100% - 20px);
`;
/**
 * Contains either the selected value or the placeholder if no value is
 * selected
 */
const SelectSpan = styled(OakSpan)`
  ${ellipsis}
`;

export function Select<
  T extends {
    value: string;
    label: string;
  },
>(props: AriaSelectProps<T> & SelectProps) {
  const { myRef, containerProps } = props;

  // Create state based on the incoming props
  const state = useSelectState({
    ...props,
    selectedKey:
      props.selectedValue === undefined ? undefined : props.selectedValue,
  });
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
      <OakFlex $position={"absolute"}>
        <RotatedInputLabel
          background={props.onFocus ? "lavender" : "lemon"}
          color={"black"}
          $font={"heading-7"}
          {...labelProps}
        >
          {props.label}
        </RotatedInputLabel>
      </OakFlex>

      <>
        <SelectButton
          {...mergeProps(buttonProps, focusProps)}
          aria-labelledby={[labelProps.id, buttonId].join(" ")}
          aria-describedby={props["aria-describedby"]}
          aria-invalid={props["aria-invalid"]}
          ref={ref}
          isOpen={state.isOpen}
          isFocusVisible={isFocusVisible}
          isPlaceholder={!state.selectedItem}
          id={buttonId}
        >
          <SelectInner $pt={"inner-padding-xs"} $alignItems={"center"}>
            {props.icon && (
              <OakIcon
                $mr={"space-between-ssx"}
                iconName={props.icon}
                $width={"all-spacing-6"}
                $height={"all-spacing-6"}
              />
            )}
            <SelectSpan
              id={valueId}
              data-testid={"select-span"}
              title={props.placeholder}
              $font={"body-2"}
            >
              {state.selectedItem
                ? state.selectedItem.rendered
                : props.placeholder}
            </SelectSpan>
          </SelectInner>
          <OakIcon
            iconName={state.isOpen ? "chevron-up" : "chevron-down"}
            $width={"all-spacing-6"}
            $height={"all-spacing-6"}
          />
        </SelectButton>
        {state.isOpen && (
          <Popover isOpen={state.isOpen} onClose={state.close}>
            <ListBox
              {...menuProps}
              state={state}
              aria-labelledby={labelProps.id}
            />
          </Popover>
        )}
      </>
    </SelectContainer>
  );
}
