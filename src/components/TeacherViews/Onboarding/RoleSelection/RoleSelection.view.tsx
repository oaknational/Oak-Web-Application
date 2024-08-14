import { zodResolver } from "@hookform/resolvers/zod";
import { OakRadioButton, OakRadioGroup } from "@oaknational/oak-components";
import { Control, UseFormTrigger, useForm } from "react-hook-form";

import FieldError from "@/components/SharedComponents/FieldError";
import Input from "@/components/SharedComponents/Input";
import OnboardingForm from "@/components/TeacherComponents/OnboardingForm/OnboardingForm";
import {
  OnboardingFormProps,
  RoleSelectFormProps,
  roleSelectFormSchema,
} from "@/components/TeacherComponents/OnboardingForm/OnboardingForm.schema";

const roleOptions: Record<string, string> = {
  "teacher-training": "Training to become a teacher",
  "teacher-trainer": "Teacher trainer",
  "private-tutor": "Private tutor",
  "adult-helping-child":
    "Adult helping a child, e.g. with revision, homeschooling",
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
    control,
    trigger,
  } = useForm<RoleSelectFormProps>({
    resolver: zodResolver(roleSelectFormSchema),
    mode: "onBlur",
    defaultValues: {
      newsletterSignUp: true,
    },
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
      canSubmit={
        formState.errors.role === undefined &&
        formState.errors.other === undefined
      }
      onSubmit={() =>
        getValues().role === "other" &&
        !getValues().other &&
        setError("other", { message: "Please tell us what your role is" })
      }
      control={control as Control<OnboardingFormProps>}
      trigger={trigger as UseFormTrigger<OnboardingFormProps>}
    >
      <OakRadioGroup
        name="role-selection"
        $flexDirection="column"
        $alignItems="flex-start"
        $gap="space-between-s"
        onChange={(event) => {
          handleChange("role", event.target.value);
          clearErrors();
        }}
      >
        {Object.entries(roleOptions).map(([value, label]) => (
          <OakRadioButton key={value} id={value} label={label} value={value} />
        ))}
      </OakRadioGroup>
      {formState.errors.role && (
        <FieldError id="role-error" withoutMarginBottom>
          {formState.errors.role.message}
        </FieldError>
      )}
      {getValues().role === "other" && (
        <Input
          id="other-role"
          error={formState.errors.other?.message}
          label="Your role"
          isRequired
          required
          onChange={(event) => handleChange("other", event.target.value)}
          $mb={0}
          placeholder="Type your role"
          withoutMarginBottom
        />
      )}
    </OnboardingForm>
  );
};

export default RoleSelectionView;
