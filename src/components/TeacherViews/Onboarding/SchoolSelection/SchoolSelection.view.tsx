import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { Control, UseFormTrigger, useForm } from "react-hook-form";

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
    <OnboardingForm
      control={control as Control<OnboardingFormProps>}
      trigger={trigger as UseFormTrigger<OnboardingFormProps>}
      formState={formState}
      heading="Select your school"
      handleSubmit={handleSubmit}
      continueDisabled={
        formState.errors?.school !== undefined || !formState.isValid
      }
    >
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
    </OnboardingForm>
  );
};

export default SchoolSelectionView;
