import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { Control, UseFormTrigger, useForm } from "react-hook-form";
import { OakBox, OakFlex, OakLink, OakP } from "@oaknational/oak-components";

import { OnboardingLayout } from "../../../TeacherComponents/OnboardingLayout/OnboardingLayout";

import useSchoolPicker from "@/components/TeacherComponents/ResourcePageSchoolPicker/useSchoolPicker";
import ResourcePageSchoolPicker from "@/components/TeacherComponents/ResourcePageSchoolPicker";
import OnboardingForm from "@/components/TeacherComponents/OnboardingForm/OnboardingForm";
import {
  OnboardingFormProps,
  SchoolSelectFormProps,
  schoolSelectFormSchema,
} from "@/components/TeacherComponents/OnboardingForm/OnboardingForm.schema";
import ManualEntrySchoolDetails from "@/components/TeacherComponents/ManualEntrySchoolDetails";
import FieldError from "@/components/SharedComponents/FieldError";

export const SchoolSelectionView = () => {
  const [renderManualSchoolInput, setRenderManualSchoolInput] =
    useState<boolean>(false);
  const { formState, setValue, handleSubmit, control, trigger, reset } =
    useForm<SchoolSelectFormProps>({
      resolver: zodResolver(schoolSelectFormSchema),
      mode: "onBlur",
    });

  const setSchoolDetailsInManualForm = useCallback(
    (isSchoolName: boolean, value: string) => {
      if (isSchoolName) {
        setValue("manualSchoolName", value, {
          shouldValidate: true,
        });
      }

      if (!isSchoolName) {
        setValue("schoolAddress", value, {
          shouldValidate: true,
        });
      }
    },
    [setValue],
  );

  const setSchoolDetailsInForm = useCallback(
    (value: string, name: string) => {
      setValue("school", value, {
        shouldValidate: true,
      });
      setValue("schoolName", name, {
        shouldValidate: true,
      });
    },
    [setValue],
  );

  const {
    selectedSchool,
    setSelectedSchool,
    schoolPickerInputValue,
    setSchoolPickerInputValue,
    schools,
  } = useSchoolPicker({ withHomeschool: false });

  useEffect(() => {
    if (selectedSchool && schoolPickerInputValue !== "") {
      setSchoolDetailsInForm(selectedSchool.toString(), schoolPickerInputValue);
    }
    if (renderManualSchoolInput) {
      reset();
    }
  }, [
    selectedSchool,
    schoolPickerInputValue,
    setSchoolDetailsInForm,
    renderManualSchoolInput,
    reset,
  ]);

  const onSchoolPickerInputChange = (value: React.SetStateAction<string>) => {
    if (value === "") {
      setSchoolDetailsInForm("", "");
    }
    setSchoolPickerInputValue(value);
  };

  return (
    <OnboardingLayout
      promptHeading={<>Nearly done&hellip;</>}
      promptBody="We need a few more details to complete your account setup."
    >
      <OnboardingForm
        control={control as Control<OnboardingFormProps>}
        trigger={trigger as UseFormTrigger<OnboardingFormProps>}
        formState={formState}
        heading="Enter school's details"
        handleSubmit={handleSubmit}
        canSubmit={!formState.isSubmitted || formState.isValid}
      >
        {renderManualSchoolInput ? (
          <ManualEntrySchoolDetails
            hasErrors={formState.errors}
            onManualSchoolInputChange={setSchoolDetailsInManualForm}
            setValue={setValue}
            control={control}
            setRenderManualSchoolInput={setRenderManualSchoolInput}
            reset={reset}
          />
        ) : (
          <OakBox $mt="space-between-m">
            <FieldError id="onboarding-school-error">
              {"school" in formState.errors && formState.errors.school?.message}
            </FieldError>
            <ResourcePageSchoolPicker
              hasError={
                !renderManualSchoolInput &&
                "school" in formState.errors &&
                formState.errors?.school !== undefined
              }
              schoolPickerInputValue={schoolPickerInputValue}
              setSchoolPickerInputValue={onSchoolPickerInputChange}
              schools={schools}
              label={"School"}
              setSelectedSchool={setSelectedSchool}
              withHomeschool={false}
            />
            <OakFlex
              $mt={"space-between-s"}
              $alignItems={"center"}
              $font={"body-2-bold"}
            >
              <OakP $font={"body-2"} $mr={"space-between-sssx"}>
                Can't find your school?
              </OakP>
              <OakLink
                onClick={() => {
                  setRenderManualSchoolInput(true);
                  reset();
                }}
                element="button"
              >
                Enter manually
              </OakLink>
            </OakFlex>
          </OakBox>
        )}
      </OnboardingForm>
    </OnboardingLayout>
  );
};

export default SchoolSelectionView;
