import { zodResolver } from "@hookform/resolvers/zod";
import { OakRadioButton, OakRadioGroup } from "@oaknational/oak-components";
import { useForm } from "react-hook-form";

import FieldError from "@/components/SharedComponents/FieldError";
import Input from "@/components/SharedComponents/Input";
import OnboardingForm from "@/components/TeacherComponents/OnboardingForm/OnboardingForm";
import {
  RoleSelectFormProps,
  roleSelectFormSchema,
} from "@/components/TeacherComponents/OnboardingForm/OnboardingForm.schema";

const roleOptions: Record<string, string> = {
  "teacher-training": "Training to become a teacher",
  "teacher-trainer": "Teacher trainer",
  "private-tutor": "Private tutor",
  "adult-helping-child": "Adult helping a child (including homeschooling)",
  "mat-or-lea": "Working at multi-academy trust or local educational authority",
  nonprofit: "Working at an educational nonprofit",
  other: "Other",
};

const RoleSelectionView = () => {
  const {
    formState,
    setValue,
    handleSubmit,
    clearErrors,
    setError,
    getValues,
  } = useForm<RoleSelectFormProps>({
    resolver: zodResolver(roleSelectFormSchema),
    mode: "onBlur",
  });

  const handleChange = (role: "other" | "role", value: string) => {
    setValue(role, value);
    clearErrors(role);
  };

  return (
    <OnboardingForm
      heading="Which of the following best describes what you do?"
      formState={formState}
      handleSubmit={handleSubmit}
      continueDisabled={
        formState.errors.role !== undefined &&
        formState.errors.other !== undefined
      }
      onSubmit={() =>
        getValues().role === "other" &&
        !getValues().other &&
        setError("other", { message: "Please tell us what your role is" })
      }
    >
      <OakRadioGroup
        name="role-selection"
        $flexDirection="column"
        $alignItems="flex-start"
        $gap="all-spacing-8"
        onChange={(event) => handleChange("role", event.target.value)}
      >
        {Object.entries(roleOptions).map(([value, label]) => (
          <OakRadioButton key={value} id={value} label={label} value={value} />
        ))}
      </OakRadioGroup>
      {formState.errors.role && (
        <FieldError id="role-error">{formState.errors.role.message}</FieldError>
      )}
      {getValues().role === "other" && (
        <>
          {formState.errors.other && (
            <FieldError id="other-error">
              {formState.errors.other.message}
            </FieldError>
          )}
          <Input
            id="other"
            label="Please specify"
            required={true}
            onChange={(event) => handleChange("other", event.target.value)}
          />
        </>
      )}
    </OnboardingForm>
  );
};

export default RoleSelectionView;
