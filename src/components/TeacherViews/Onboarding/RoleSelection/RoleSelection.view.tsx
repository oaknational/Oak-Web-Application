import { zodResolver } from "@hookform/resolvers/zod";
import { OakRadioButton, OakRadioGroup } from "@oaknational/oak-components";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";

import FieldError from "@/components/SharedComponents/FieldError";
import Input from "@/components/SharedComponents/Input";
import OnboardingForm from "@/components/TeacherComponents/OnboardingForm/OnboardingForm";

const roleOptions: Record<string, string> = {
  "teacher-training": "Training to become a teacher",
  "teacher-trainer": "Teacher trainer",
  "private-tutor": "Private tutor",
  "adult-helping-child": "Adult helping a child (including homeschooling)",
  "mat-or-lea": "Working at multi-academy trust or local educational authority",
  nonprofit: "Working at an educational nonprofit",
  other: "Other",
};

const roleSelectFormSchema = z.object({
  role: z.string({
    errorMap: () => ({
      message: "Select a role",
    }),
  }),
  other: z.string().optional(),
});
type RoleSelectFormValues = z.infer<typeof roleSelectFormSchema>;
export type RoleSelectFormProps = RoleSelectFormValues & {
  onSubmit: (values: RoleSelectFormValues) => Promise<void>;
};

const RoleSelectionView = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const { formState, setValue, handleSubmit } = useForm<RoleSelectFormProps>({
    resolver: zodResolver(roleSelectFormSchema),
    mode: "onBlur",
  });

  const handleChange = (role: string) => {
    setValue("role", role);
    setSelectedRole(role);
  };

  return (
    <OnboardingForm
      heading="Which of the following best describes what you do?"
      formState={formState}
      handleSubmit={handleSubmit}
    >
      <OakRadioGroup
        name="role-selection"
        $flexDirection="column"
        $alignItems="flex-start"
        $gap="all-spacing-8"
        onChange={(event) => handleChange(event.target.value)}
      >
        {Object.entries(roleOptions).map(([value, label]) => (
          <OakRadioButton key={value} id={value} label={label} value={value} />
        ))}
      </OakRadioGroup>
      {formState.errors.role && (
        <FieldError id="role-error">{formState.errors.role.message}</FieldError>
      )}
      {selectedRole === "other" && (
        <>
          {}
          <Input id="other" label="Please specify" required={true} />
        </>
      )}
    </OnboardingForm>
  );
};

export default RoleSelectionView;
