import { zodResolver } from "@hookform/resolvers/zod";
import {
  OakBox,
  OakRadioButton,
  OakRadioGroup,
} from "@oaknational/oak-components";
import { Control, UseFormTrigger, useForm } from "react-hook-form";

import { OnboardingLayout } from "../../../TeacherComponents/OnboardingLayout/OnboardingLayout";

import OnboardingForm from "@/components/TeacherComponents/OnboardingForm/OnboardingForm";
import {
  OnboardingFormProps,
  RoleSelectFormProps,
  roleSelectFormSchema,
} from "@/components/TeacherComponents/OnboardingForm/OnboardingForm.schema";
import FieldError from "@/components/SharedComponents/FieldError";
import {
  onboardingRoleOptions,
  OnboardingRoleType,
} from "@/components/TeacherComponents/OnboardingForm/onboardingActions/onboardingRoleOptions";
import { OakInputWithLabel } from "@/components/SharedComponents/OakInputWithLabel/OakInputWithLabel";

const RoleSelectionView = () => {
  const {
    formState,
    setValue,
    handleSubmit,
    clearErrors,
    getValues,
    control,
    trigger,
    register,
  } = useForm<RoleSelectFormProps>({
    resolver: zodResolver(roleSelectFormSchema),
    mode: "onBlur",
    defaultValues: {
      newsletterSignUp: false,
    },
  });

  const handleChange = (role: "other" | "role", value: string) => {
    setValue(role, value);
    clearErrors(role);
  };

  const { onChange, ref, ...rest } = register("other");

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
        control={control as Control<OnboardingFormProps>}
        trigger={trigger as UseFormTrigger<OnboardingFormProps>}
      >
        {formState.errors.role && (
          <FieldError id="role-error">
            {formState.errors.role.message}
          </FieldError>
        )}
        <OakRadioGroup
          name="role-selection"
          $flexDirection="column"
          $alignItems="flex-start"
          $gap="space-between-s"
          onChange={(event) => {
            handleChange("role", getRoleValue(event.target.value) ?? "");
            clearErrors();
          }}
          aria-describedby={formState.errors.role ? "role-error" : undefined}
        >
          {Object.entries(onboardingRoleOptions).map(([value, label]) => (
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
          <OakBox $mt="space-between-l">
            <OakInputWithLabel
              id="other-role"
              error={formState.errors.other?.message}
              label="Your role"
              required
              placeholder="Type your role"
              aria-describedby={
                formState.errors.other ? "other-role" : undefined
              }
              {...rest}
              onChange={(event) => handleChange("other", event.target.value)}
            />
          </OakBox>
        )}
      </OnboardingForm>
    </OnboardingLayout>
  );
};

export default RoleSelectionView;

function getRoleValue(role: string) {
  if (role in onboardingRoleOptions) {
    return onboardingRoleOptions[role as OnboardingRoleType];
  }
}
