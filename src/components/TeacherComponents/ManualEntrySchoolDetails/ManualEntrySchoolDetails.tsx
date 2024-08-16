import React, { Dispatch, SetStateAction, FC, ChangeEvent } from "react";
import { OakBox, OakLink } from "@oaknational/oak-components";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormReset,
  UseFormSetValue,
} from "react-hook-form";

import { SchoolSelectFormProps } from "../OnboardingForm/OnboardingForm.schema";

import FieldError from "@/components/SharedComponents/FieldError";
import Input from "@/components/SharedComponents/Input";

type ManualEntrySchoolDetailsProps = {
  setValue: UseFormSetValue<SchoolSelectFormProps>;
  setRenderManualSchoolInput: Dispatch<SetStateAction<boolean>>;
  control: Control<SchoolSelectFormProps>;
  hasErrors: FieldErrors<SchoolSelectFormProps>;
  onManualSchoolInputChange: (isSchoolName: boolean, value: string) => void;
  reset: UseFormReset<SchoolSelectFormProps>;
};

const ManualEntrySchoolDetails: FC<ManualEntrySchoolDetailsProps> = ({
  setRenderManualSchoolInput,
  control,
  onManualSchoolInputChange,

  hasErrors,
  reset,
}) => {
  return (
    <>
      {"manualSchoolName" in hasErrors && (
        <FieldError withoutMarginBottom id={"school-name-error"}>
          Enter school name
        </FieldError>
      )}
      <Controller
        name="manualSchoolName"
        control={control}
        render={({ field: { onChange, onBlur, value } }) => {
          const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
            onChange(e.target.value);
            if (e.target.value.length > 2) {
              onManualSchoolInputChange(true, e.target.value);
            }
          };
          const onBlurHandler = () => {
            onBlur();
            onManualSchoolInputChange(true, value);
          };

          return (
            <Input
              label="School name"
              placeholder="Type school name"
              value={value}
              isRequired
              id={"school-name"}
              withoutMarginBottom
              onBlur={onBlurHandler}
              onChange={onChangeHandler}
            />
          );
        }}
      />
      {"schoolAddress" in hasErrors && (
        <FieldError withoutMarginBottom id={"school-address-error"}>
          Enter school address
        </FieldError>
      )}

      <Controller
        name="schoolAddress"
        control={control}
        render={({ field: { onChange, onBlur, value } }) => {
          const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
            onChange(e.target.value);
            if (e.target.value.length > 2) {
              onManualSchoolInputChange(false, e.target.value);
            }
          };

          const onBlurHandler = () => {
            onBlur();
            onManualSchoolInputChange(false, value);
          };

          return (
            <Input
              label="School address"
              placeholder="Type school address"
              value={value}
              isRequired
              withoutMarginBottom
              id={"school-address"}
              onBlur={onBlurHandler}
              onChange={onChangeHandler}
            />
          );
        }}
      />
      <OakBox $font="body-2-bold">
        <OakLink
          onClick={() => {
            setRenderManualSchoolInput((prev) => !prev);
            reset();
          }}
          element="button"
        >
          Select from dropdown
        </OakLink>
      </OakBox>
    </>
  );
};

export default ManualEntrySchoolDetails;
