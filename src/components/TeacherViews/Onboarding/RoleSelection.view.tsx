import { zodResolver } from "@hookform/resolvers/zod";
import { OakFlex, OakPrimaryButton } from "@oaknational/oak-components";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Logo from "@/components/AppComponents/Logo";

const onboardingFormSchema = z.object({
  school: z
    .string({
      errorMap: () => ({
        message: "Select school",
      }),
    })
    .min(1, "Select school"),
  schoolName: z.string().optional(),
});
type OnboardingFormValues = z.infer<typeof onboardingFormSchema>;
type OnboardingFormProps = OnboardingFormValues & {
  onSubmit: (values: OnboardingFormValues) => Promise<void>;
};

export const RoleSelectionView = () => {
  const { formState, handleSubmit } = useForm<OnboardingFormProps>({
    resolver: zodResolver(onboardingFormSchema),
    mode: "onBlur",
  });

  const onFormSubmit = async (data: OnboardingFormProps) => {
    // TODO: something with this data
    console.log("onboarding form values: ", data);
  };

  return (
    <OakFlex
      $flexDirection="column"
      $width="all-spacing-21"
      $gap="space-between-m"
    >
      <OakFlex
        $flexDirection="column"
        $alignItems="flex-start"
        $gap="all-spacing-8"
        $pa="inner-padding-xl3"
        $dropShadow="drop-shadow-standard"
        $borderRadius="border-radius-s"
        as="form"
        onSubmit={
          (event) => void handleSubmit(onFormSubmit)(event) // https://github.com/orgs/react-hook-form/discussions/8622}
        }
      >
        <Logo height={48} width={104} variant="with text" />

        <OakPrimaryButton
          disabled={
            formState.errors?.school !== undefined || !formState.isValid
          }
          width="100%"
          type="submit"
        >
          Continue
        </OakPrimaryButton>
      </OakFlex>
    </OakFlex>
  );
};

export default RoleSelectionView;
