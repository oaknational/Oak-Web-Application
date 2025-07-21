import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { Control, UseFormTrigger, useForm } from "react-hook-form";
import {
  OakBox,
  OakFlex,
  OakLink,
  OakP,
  OakSpan,
} from "@oaknational/oak-components";

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

type SchoolSelectionView = "school-picker" | "manual-entry" | "oak-support";

export const SchoolSelectionView = () => {
  const [activeView, setActiveView] =
    useState<SchoolSelectionView>("school-picker");

  const {
    formState,
    setValue,
    handleSubmit,
    control,
    trigger,
    reset,
    register,
  } = useForm<SchoolSelectFormProps>({
    resolver: zodResolver(schoolSelectFormSchema),
    mode: "onBlur",
    defaultValues: {
      newsletterSignUp: false,
    },
  });

  const setSchoolDetailsInManualForm = useCallback(
    (isSchoolName: boolean, value: string) => {
      if (isSchoolName) {
        setValue("manualSchoolName", value, {
          shouldValidate: true,
        });
      } else {
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
    if (activeView === "manual-entry") {
      reset();
    }
  }, [
    selectedSchool,
    schoolPickerInputValue,
    setSchoolDetailsInForm,
    activeView,
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
        heading="Select your school"
        handleSubmit={handleSubmit}
        canSubmit={!formState.isSubmitted || formState.isValid}
      >
        {activeView === "school-picker" && (
          <OakBox $mt="space-between-m">
            <FieldError id="onboarding-school-error">
              {"school" in formState.errors && formState.errors.school?.message}
            </FieldError>
            <ResourcePageSchoolPicker
              hasError={
                activeView === "school-picker" &&
                "school" in formState.errors &&
                formState.errors?.school !== undefined
              }
              schoolPickerInputValue={schoolPickerInputValue}
              setSchoolPickerInputValue={onSchoolPickerInputChange}
              schools={schools}
              label={"School"}
              setSelectedSchool={setSelectedSchool}
              withHomeschool={false}
              required
            />
            <OakFlex
              $mt={"space-between-s"}
              $alignItems={"center"}
              $font={"body-2-bold"}
              $width={"100%"}
            >
              <OakP $font={"body-2"}>
                Can't find your school?{" "}
                <OakSpan $font="body-2-bold">
                  <OakLink
                    onClick={() => {
                      setActiveView("manual-entry");
                      reset();
                    }}
                    element="button"
                  >
                    Enter manually
                  </OakLink>
                </OakSpan>
              </OakP>
            </OakFlex>
          </OakBox>
        )}

        {activeView === "manual-entry" && (
          <ManualEntrySchoolDetails
            hasErrors={formState.errors}
            onManualSchoolInputChange={setSchoolDetailsInManualForm}
            setValue={setValue}
            control={control}
            onSelectFromDropdown={() => setActiveView("school-picker")}
            reset={reset}
            register={register}
          />
        )}
      </OnboardingForm>
    </OnboardingLayout>
  );
};

export default SchoolSelectionView;
