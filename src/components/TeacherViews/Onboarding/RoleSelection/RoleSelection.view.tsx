import { zodResolver } from "@hookform/resolvers/zod";
import {
  OakBox,
  OakRadioButton,
  OakRadioGroup,
} from "@oaknational/oak-components";
import { Control, UseFormTrigger, useForm } from "react-hook-form";

import { OnboardingLayout } from "../../../TeacherComponents/OnboardingLayout/OnboardingLayout";

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
  nonprofit: "Working at an education nonprofit",
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
    <OnboardingLayout
      promptHeading={<>Last step&hellip;</>}
      promptBody="We need a few more details to complete your account setup."
    >
      <OnboardingForm
        heading="Which of the following best describes what you do?"
        formState={formState}
        handleSubmit={handleSubmit}
        canSubmit={
          formState.errors.role === undefined &&
          formState.errors.other === undefined
        }
        onSubmit={() => {
          if (getValues().role === "Other" && !getValues().other) {
            setError("other", {
              message: "Please tell us what your role is",
            });
          } else if (!getValues().role) {
            setError("role", { message: "Please select your role" });
          }
        }}
        control={control as Control<OnboardingFormProps>}
        trigger={trigger as UseFormTrigger<OnboardingFormProps>}
      >
        <OakRadioGroup
          name="role-selection"
          $flexDirection="column"
          $alignItems="flex-start"
          $gap="space-between-s"
          onChange={(event) => {
            handleChange("role", roleOptions[event.target.value] || "");
            clearErrors();
          }}
          aria-describedby={formState.errors.role ? "role-error" : undefined}
        >
          {Object.entries(roleOptions).map(([value, label]) => (
            <OakRadioButton
              key={value}
              id={value}
              label={label}
              value={value}
              required
            />
          ))}
        </OakRadioGroup>
        {getValues().role === "Other" && (
          <OakBox $mt="space-between-m">
            <Input
              id="other-role"
              error={formState.errors.other?.message}
              label="Your role"
              isRequired
              required
              onChange={(event) => handleChange("other", event.target.value)}
              $mb={0}
              placeholder="Type your role"
              aria-describedby={
                formState.errors.other ? "other-role" : undefined
              }
            />
          </OakBox>
        )}
      </OnboardingForm>
    </OnboardingLayout>
  );
};

export default RoleSelectionView;
