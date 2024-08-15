import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { Control, UseFormTrigger, useForm } from "react-hook-form";
import { OakBox, OakFlex, OakMaxWidth } from "@oaknational/oak-components";

import useSchoolPicker from "@/components/TeacherComponents/ResourcePageSchoolPicker/useSchoolPicker";
import ResourcePageSchoolPicker from "@/components/TeacherComponents/ResourcePageSchoolPicker";
import OnboardingForm from "@/components/TeacherComponents/OnboardingForm/OnboardingForm";
import {
  OnboardingFormProps,
  SchoolSelectFormProps,
  schoolSelectFormSchema,
} from "@/components/TeacherComponents/OnboardingForm/OnboardingForm.schema";

export const SchoolSelectionView = () => {
  const { formState, setValue, handleSubmit, control, trigger } =
    useForm<SchoolSelectFormProps>({
      resolver: zodResolver(schoolSelectFormSchema),
      mode: "onBlur",
      defaultValues: {
        newsletterSignUp: true,
      },
    });

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
  }, [selectedSchool, schoolPickerInputValue, setSchoolDetailsInForm]);

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
            <OakBox $mt={"space-between-s"}>
              <ResourcePageSchoolPicker
                hasError={formState.errors?.school !== undefined}
                schoolPickerInputValue={schoolPickerInputValue}
                setSchoolPickerInputValue={onSchoolPickerInputChange}
                schools={schools}
                label={"School"}
                setSelectedSchool={setSelectedSchool}
                required={true}
                withHomeschool={false}
              />
            </OakBox>
          </OnboardingForm>
        </OakBox>
      </OakMaxWidth>
    </OakFlex>
  );
};

export default SchoolSelectionView;
