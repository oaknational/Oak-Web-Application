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

import Input from "@/components/SharedComponents/Input";

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
      $mt={
        "manualSchoolName" in hasErrors
          ? "space-between-none"
          : "space-between-m"
      }
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
            <Input
              label="School name"
              placeholder="Type school name"
              value={value ?? ""}
              isRequired
              required
              id={"school-name"}
              onBlur={onBlurHandler}
              onChange={onChangeHandler}
              error={
                "manualSchoolName" in hasErrors
                  ? "Enter school name"
                  : undefined
              }
              $mb={"schoolAddress" in hasErrors ? 16 : 32}
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
            <Input
              label="School address"
              placeholder="Type school address"
              value={value ?? ""}
              isRequired
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
