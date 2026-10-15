"use client";

import {
  OakBox,
  OakFieldError,
  OakOption,
  OakSelect,
} from "@oaknational/oak-components";

import { NationalCurriculumInsightsFieldLabel } from "./FieldLabel";

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

export const NationalCurriculumInsightsSelect = ({
  id,
  label,
  name,
  onChange,
  options,
  placeholder,
  value,
  error,
}: NationalCurriculumInsightsSelectProps) => (
  <OakBox
    $position="relative"
    $width="100%"
    role="group"
    aria-labelledby={`${id}-label`}
    aria-describedby={error ? `${id}-error` : undefined}
  >
    <NationalCurriculumInsightsFieldLabel
      htmlFor={id}
      id={`${id}-label`}
      label={label}
      invalid={Boolean(error)}
    />
    <OakSelect
      id={id}
      name={name}
      $display="block"
      value={value}
      validity={error ? "invalid" : undefined}
      onChange={(event) => onChange(event.target.value)}
    >
      <OakOption asDefault value="" disabled>
        {placeholder}
      </OakOption>
      {options.map((option) => (
        <OakOption key={option.value} value={option.value}>
          {option.label}
        </OakOption>
      ))}
    </OakSelect>
    {error ? (
      <OakBox id={`${id}-error`} role="alert" $mt="spacing-8">
        <OakFieldError>{error}</OakFieldError>
      </OakBox>
    ) : null}
  </OakBox>
);
