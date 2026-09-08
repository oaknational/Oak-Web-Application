"use client";

import {
  OakFieldError,
  OakIcon,
  OakJauntyAngleLabel,
  OakSpan,
  parseColor,
} from "@oaknational/oak-components";
import { mergeProps, useButton, useFocusRing, useSelect } from "react-aria";
import { Item, useSelectState } from "react-stately";
import { useId, useRef } from "react";
import styled from "styled-components";

import { Label, ListBox } from "@/components/SharedComponents/ListBox/ListBox";
import { Popover } from "@/components/SharedComponents/Popover";

export type NationalCurriculumInsightsSelectOption = {
  label: string;
  value: string;
};

type NationalCurriculumInsightsSelectProps = {
  id: string;
  label: string;
  name: string;
  onChange: (value: string) => void;
  options: NationalCurriculumInsightsSelectOption[];
  placeholder: string;
  value: string;
  error?: string;
};

const Container = styled.div`
  position: relative;
  width: 100%;

  &:focus-within > label {
    background: ${parseColor("blue")};
    color: ${parseColor("text-inverted")};
  }
`;

const Trigger = styled.button`
  box-sizing: border-box;
  display: flex;
  width: 100%;
  min-height: 64px;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border: 2px solid ${parseColor("border-primary")};
  border-radius: 4px;
  background: ${parseColor("bg-primary")};
  color: ${parseColor("text-primary")};
  font: inherit;
  font-size: 16px;
  line-height: 24px;
  text-align: left;
  cursor: pointer;

  &:focus-visible {
    outline: 4px solid ${parseColor("border-decorative5")};
    outline-offset: 2px;
  }
`;

const Menu = styled.div`
  border: 2px solid ${parseColor("border-primary")};
  border-top: 0;
  background: ${parseColor("bg-primary")};
`;

const renderSelectOption = (option: NationalCurriculumInsightsSelectOption) => (
  <Item key={option.value} textValue={option.label} aria-label={option.label}>
    <Label>{option.label}</Label>
  </Item>
);

export const NationalCurriculumInsightsSelect = ({
  id,
  label,
  name,
  onChange,
  options,
  placeholder,
  value,
  error,
}: NationalCurriculumInsightsSelectProps) => {
  const generatedId = useId();
  const labelId = `${generatedId}-label`;
  const errorId = `${id}-error`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const selectProps = {
    "aria-label": label,
    children: renderSelectOption,
    items: options,
    label,
    onSelectionChange: (key: React.Key) => onChange(String(key)),
    selectedKey: value || null,
  };
  const state = useSelectState(selectProps);
  const { triggerProps, menuProps } = useSelect(selectProps, state, triggerRef);
  const { buttonProps } = useButton(triggerProps, triggerRef);
  const { focusProps } = useFocusRing();

  return (
    <Container>
      <OakJauntyAngleLabel
        as="label"
        htmlFor={id}
        id={labelId}
        label={label}
        $background="bg-decorative5-main"
        $color="text-primary"
        $font="heading-7"
        $position="absolute"
        $top="-20px"
        $left="spacing-8"
        $zIndex="in-front"
        $borderRadius="border-radius-square"
      />
      <Trigger
        {...mergeProps(buttonProps, focusProps)}
        id={id}
        ref={triggerRef}
        name={name}
        aria-labelledby={`${labelId} ${id}-value`}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={Boolean(error)}
      >
        <OakSpan id={`${id}-value`} $font="body-2">
          {state.selectedItem?.textValue ?? placeholder}
        </OakSpan>
        <OakIcon
          iconName={state.isOpen ? "chevron-up" : "chevron-down"}
          $width="spacing-24"
          $height="spacing-24"
          aria-hidden
        />
      </Trigger>
      {state.isOpen ? (
        <Popover isOpen onClose={state.close} focusOn={false} isDismissable>
          <Menu>
            <ListBox {...menuProps} state={state} aria-labelledby={labelId} />
          </Menu>
        </Popover>
      ) : null}
      {error ? (
        <div id={errorId}>
          <OakFieldError>{error}</OakFieldError>
        </div>
      ) : null}
    </Container>
  );
};
