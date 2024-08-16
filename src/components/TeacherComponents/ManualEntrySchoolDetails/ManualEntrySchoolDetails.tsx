import React, { Dispatch, SetStateAction, FC, ChangeEvent } from "react";
import { OakBox, OakLink } from "@oaknational/oak-components";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormReset,
  UseFormSetValue,
} from "react-hook-form";

import SchoolDetailsInputBox from "../SchoolDetailsInputBox";
import { SchoolSelectFormProps } from "../OnboardingForm/OnboardingForm.schema";

import FieldError from "@/components/SharedComponents/FieldError";

type ManualEntrySchoolDetailsProps = {
  manualSchoolName: string;
  manualSchoolAddress: string;
  setManualSchoolName: Dispatch<SetStateAction<string>>;
  setManualSchoolAddress: Dispatch<SetStateAction<string>>;
  setValue: UseFormSetValue<SchoolSelectFormProps>;
  setRenderManualSchoolInput: Dispatch<SetStateAction<boolean>>;
  control: Control<SchoolSelectFormProps>;
  hasErrors: FieldErrors<SchoolSelectFormProps>;
  onManualSchoolInputChange: (
    manualSchoolName: string,
    schoolAddress: string,
  ) => void;
  reset: UseFormReset<SchoolSelectFormProps>;
};

const ManualEntrySchoolDetails: FC<ManualEntrySchoolDetailsProps> = ({
  setRenderManualSchoolInput,
  control,
  onManualSchoolInputChange,
  setManualSchoolName,
  setManualSchoolAddress,
  manualSchoolAddress,
  manualSchoolName,
  hasErrors,
  reset,
}) => {
  return (
    <>
      {"manualSchoolName" in hasErrors && hasErrors.manualSchoolName && (
        <FieldError withoutMarginBottom id={"school-name-error"}>
          Enter school name
        </FieldError>
      )}
      <Controller
        name="manualSchoolName"
        control={control}
        render={({ field: { onChange, onBlur }, fieldState: { error } }) => {
          const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
            onChange(e.target.value);
            setManualSchoolName(e.target.value);
            onManualSchoolInputChange(e.target.value, manualSchoolAddress);
          };

          return (
            <SchoolDetailsInputBox
              labelText="School name"
              placeholder="Type school name"
              background="lemon"
              hasError={!!error}
              onBlur={onBlur}
              onChange={onChangeHandler}
            />
          );
        }}
      />
      {"schoolAddress" in hasErrors && hasErrors.schoolAddress && (
        <FieldError withoutMarginBottom id={"school-address-error"}>
          Enter school address
        </FieldError>
      )}
      <Controller
        name="schoolAddress"
        control={control}
        render={({ field: { onChange, onBlur }, fieldState: { error } }) => {
          const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
            onChange(e.target.value);
            setManualSchoolAddress(e.target.value);
            onManualSchoolInputChange(manualSchoolName, e.target.value);
          };

          return (
            <SchoolDetailsInputBox
              labelText="School address"
              placeholder="Type school address"
              background="lemon"
              hasError={!!error}
              onBlur={onBlur}
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
