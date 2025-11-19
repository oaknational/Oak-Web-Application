import React, { FC, ChangeEvent } from "react";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormReset,
  UseFormSetValue,
} from "react-hook-form";
import { OakBox, OakFlex, OakLink } from "@oaknational/oak-components";

import { SchoolSelectFormProps } from "../OnboardingForm/OnboardingForm.schema";

import { OakInputWithLabel } from "@/components/SharedComponents/OakInputWithLabel/OakInputWithLabel";

type ManualEntrySchoolDetailsProps = {
  setValue: UseFormSetValue<SchoolSelectFormProps>;
  onSelectFromDropdown: () => void;
  control: Control<SchoolSelectFormProps>;
  hasErrors: FieldErrors<SchoolSelectFormProps>;
  onManualSchoolInputChange: (isSchoolName: boolean, value: string) => void;
  reset: UseFormReset<SchoolSelectFormProps>;
};

const ManualEntrySchoolDetails: FC<ManualEntrySchoolDetailsProps> = ({
  onSelectFromDropdown: setRenderManualSchoolInput,
  control,
  onManualSchoolInputChange,
  hasErrors,
  reset,
}) => {
  return (
    <OakFlex
      $flexDirection={"column"}
      $gap="spacing-48"
      $mt={"manualSchoolName" in hasErrors ? "spacing-0" : "spacing-24"}
    >
      <Controller
        name="manualSchoolName"
        control={control}
        render={({ field: { onChange, onBlur, value } }) => {
          const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
            onChange(e.target.value);
            onManualSchoolInputChange(true, e.target.value);
          };
          const onBlurHandler = () => {
            onBlur();
            onManualSchoolInputChange(true, value);
          };

          return (
            <OakInputWithLabel
              label="School name"
              placeholder="Type school name"
              name="manualSchoolName"
              required
              id={"school-name"}
              onBlur={onBlurHandler}
              onChange={onChangeHandler}
              error={
                "manualSchoolName" in hasErrors
                  ? "Enter school name"
                  : undefined
              }
            />
          );
        }}
      />
      <Controller
        name="schoolAddress"
        control={control}
        render={({ field: { onChange, onBlur, value } }) => {
          const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
            onChange(e.target.value);
            onManualSchoolInputChange(false, e.target.value);
          };

          const onBlurHandler = () => {
            onBlur();
            onManualSchoolInputChange(false, value);
          };

          return (
            <OakInputWithLabel
              label="School address"
              placeholder="Type school address"
              name="schoolAddress"
              required
              id={"school-address"}
              onBlur={onBlurHandler}
              onChange={onChangeHandler}
              error={
                "schoolAddress" in hasErrors
                  ? "Enter school address"
                  : undefined
              }
            />
          );
        }}
      />
      <OakBox $font="body-2-bold">
        <OakLink
          onClick={() => {
            setRenderManualSchoolInput();
            reset();
          }}
          element="button"
        >
          Select from dropdown
        </OakLink>
      </OakBox>
    </OakFlex>
  );
};

export default ManualEntrySchoolDetails;
