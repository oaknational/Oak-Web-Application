import { zodResolver } from "@hookform/resolvers/zod";
import {
  OakBox,
  OakFlex,
  OakHeading,
  OakPrimaryButton,
  OakRadioButton,
  OakRadioGroup,
} from "@oaknational/oak-components";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Logo from "@/components/AppComponents/Logo";

const onboardingFormSchema = z.object({
  worksInSchool: z.boolean({
    errorMap: () => ({
      message: "Please select if you work in a school",
    }),
  }),
});
type OnboardingFormValues = z.infer<typeof onboardingFormSchema>;
type OnboardingFormProps = OnboardingFormValues & {
  onSubmit: (values: OnboardingFormValues) => Promise<void>;
};

export const OnboardingView = () => {
  const { formState, setValue, handleSubmit, watch } =
    useForm<OnboardingFormProps>({
      resolver: zodResolver(onboardingFormSchema),
      mode: "onBlur",
    });
  const worksInSchool = watch("worksInSchool");

  const setWorksInSchool = useCallback(
    (value: boolean) => {
      setValue("worksInSchool", value, {
        shouldValidate: true,
      });
    },
    [setValue],
  );

  const onFormSubmit = async (data: OnboardingFormProps) => {
    // TODO: something with this data

    console.log("Hi onboarding form values: ", data);
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
        $pa="inner-padding-xl3"
        $dropShadow="drop-shadow-standard"
        $borderRadius="border-radius-s"
        as="form"
        onSubmit={
          (event) => void handleSubmit(onFormSubmit)(event) // https://github.com/orgs/react-hook-form/discussions/8622}
        }
      >
        <Logo height={48} width={104} variant="with text" />
        <OakHeading
          $mb={"space-between-s"}
          $mt={"space-between-m"}
          tag="h2"
          $font="heading-light-6"
        >
          Do you work in a school?
        </OakHeading>
        <OakBox $pv={"inner-padding-xl"}>
          <OakRadioGroup
            onChange={(value) =>
              setWorksInSchool(value.target.value === "yes" ? true : false)
            }
            $flexDirection={"column"}
            name={"Do you work in a school?"}
          >
            <OakRadioButton id="option-1" label="Yes" value="yes" />
            <OakRadioButton id="option-2" label="No" value="no" />
          </OakRadioGroup>
        </OakBox>

        <OakPrimaryButton
          $mv={"space-between-m"}
          disabled={
            formState.errors?.worksInSchool !== undefined || !formState.isValid
          }
          element={
            formState.errors?.worksInSchool !== undefined || !formState.isValid
              ? "button"
              : "a"
          }
          href={
            // this should be added to url.tsx
            worksInSchool
              ? "/onboarding/school-selection"
              : "/onboarding/role-selection"
          }
          type="submit"
        >
          Continue
        </OakPrimaryButton>
      </OakFlex>
    </OakFlex>
  );
};

export default OnboardingView;
