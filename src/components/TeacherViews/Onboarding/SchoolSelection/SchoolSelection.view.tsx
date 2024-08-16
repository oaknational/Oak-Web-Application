import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { Control, UseFormTrigger, useForm } from "react-hook-form";
import {
  OakBox,
  OakFlex,
  OakMaxWidth,
  OakLink,
  OakP,
} from "@oaknational/oak-components";

import useSchoolPicker from "@/components/TeacherComponents/ResourcePageSchoolPicker/useSchoolPicker";
import ResourcePageSchoolPicker from "@/components/TeacherComponents/ResourcePageSchoolPicker";
import OnboardingForm from "@/components/TeacherComponents/OnboardingForm/OnboardingForm";
import {
  OnboardingFormProps,
  SchoolSelectFormProps,
  schoolSelectFormSchema,
} from "@/components/TeacherComponents/OnboardingForm/OnboardingForm.schema";
import ManualEntrySchoolDetails from "@/components/TeacherComponents/ManualEntrySchoolDetails";

export const SchoolSelectionView = () => {
  const [renderManualSchoolInput, setRenderManualSchoolInput] =
    useState<boolean>(false);
  const [manualSchoolName, setManualSchoolName] = useState<string>("");
  const [manualSchoolAddress, setManualSchoolAddress] = useState<string>("");
  const { formState, setValue, handleSubmit, control, trigger, reset } =
    useForm<SchoolSelectFormProps>({
      resolver: zodResolver(schoolSelectFormSchema),
      mode: "onBlur",
      defaultValues: {
        newsletterSignUp: true,
      },
    });

  const setSchoolDetailsInManualForm = useCallback(
    (manualSchoolName: string, schoolAddress: string) => {
      setValue("schoolAddress", schoolAddress, {
        shouldValidate: true,
      });
      setValue("manualSchoolName", manualSchoolName, {
        shouldValidate: true,
      });
    },
    [setValue],
  );

  const onManualSchoolInputChange = (
    manualSchoolName: string,
    schoolAddress: string,
  ) => {
    if (manualSchoolName === "" && schoolAddress === "") {
      setSchoolDetailsInManualForm("", "");
    }
    setSchoolDetailsInManualForm(manualSchoolName, schoolAddress);
  };

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
    <OakFlex $background={"bg-decorative1-main"}>
      <OakMaxWidth $justifyContent={"center"} $height={"100vh"}>
        <OakBox $maxWidth={"all-spacing-21"}>
          <OnboardingForm
            control={control as Control<OnboardingFormProps>}
            trigger={trigger as UseFormTrigger<OnboardingFormProps>}
            formState={formState}
            heading="Select your school"
            handleSubmit={handleSubmit}
            canSubmit={formState.isValid}
          >
            {!renderManualSchoolInput && (
              <>
                <OakBox $mt={"space-between-s"}>
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
                    required={true}
                    withHomeschool={false}
                  />
                </OakBox>
                <OakFlex
                  $mt={"space-between-none"}
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
              </>
            )}

            {renderManualSchoolInput && (
              <ManualEntrySchoolDetails
                hasErrors={formState.errors}
                onManualSchoolInputChange={onManualSchoolInputChange}
                setValue={setValue}
                control={control}
                setRenderManualSchoolInput={setRenderManualSchoolInput}
                manualSchoolName={manualSchoolName}
                manualSchoolAddress={manualSchoolAddress}
                setManualSchoolName={setManualSchoolName}
                setManualSchoolAddress={setManualSchoolAddress}
                reset={reset}
              />
            )}
          </OnboardingForm>
        </OakBox>
      </OakMaxWidth>
    </OakFlex>
  );
};

export default SchoolSelectionView;
