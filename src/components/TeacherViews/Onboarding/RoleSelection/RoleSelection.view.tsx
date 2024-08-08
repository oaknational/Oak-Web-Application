import { zodResolver } from "@hookform/resolvers/zod";
import {
  OakFlex,
  OakHeading,
  OakPrimaryButton,
  OakRadioButton,
  OakRadioGroup,
} from "@oaknational/oak-components";
import { useForm } from "react-hook-form";
import { z } from "zod";

import FieldError from "@/components/SharedComponents/FieldError";

const roleOptions: Record<string, string> = {
  "teacher-training": "Training to become a teacher",
  "teacher-trainer": "Teacher trainer",
  "private-tutor": "Private tutor",
  "adult-helping-child": "Adult helping a child (including homeschooling)",
  "mat-or-lea": "Working at multi-academy trust or local educational authority",
  nonprofit: "Working at an educational nonprofit",
};

const roleSelectFormSchema = z.object({
  role: z.string({
    errorMap: () => ({
      message: "Select a role",
    }),
  }),
});
type RoleSelectFormValues = z.infer<typeof roleSelectFormSchema>;
type RoleSelectFormProps = RoleSelectFormValues & {
  onSubmit: (values: RoleSelectFormValues) => Promise<void>;
};

const RoleSelectionView = () => {
  const { formState, setValue, handleSubmit } = useForm<RoleSelectFormProps>({
    resolver: zodResolver(roleSelectFormSchema),
    mode: "onBlur",
  });

  const onFormSubmit = async (values: RoleSelectFormValues) => {
    console.log("TODO: something with these values", values);
  };

  return (
    <OakFlex
      $flexDirection="column"
      $pa="inner-padding-xl3"
      $dropShadow="drop-shadow-standard"
      $borderRadius="border-radius-s"
      $width="all-spacing-21"
      $gap="space-between-m"
      as="form"
      onSubmit={
        (event) => void handleSubmit(onFormSubmit)(event) // https://github.com/orgs/react-hook-form/discussions/8622}
      }
    >
      <OakHeading tag="h2" $font="heading-light-5">
        Which of the following best describes what you do?
      </OakHeading>
      <OakRadioGroup
        name="role-selection"
        $flexDirection="column"
        $alignItems="flex-start"
        $gap="all-spacing-8"
        onChange={(event) => setValue("role", event.target.value)}
      >
        {Object.entries(roleOptions).map(([value, label]) => (
          <OakRadioButton key={value} id={value} label={label} value={value} />
        ))}
      </OakRadioGroup>
      {formState.errors.role && (
        <FieldError id="role-error">{formState.errors.role.message}</FieldError>
      )}
      <OakPrimaryButton
        width="100%"
        type="submit"
        disabled={!!formState.errors.role}
      >
        Continue
      </OakPrimaryButton>
    </OakFlex>
  );
};

export default RoleSelectionView;
