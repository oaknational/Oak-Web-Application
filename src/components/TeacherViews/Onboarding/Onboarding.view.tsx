import { zodResolver } from "@hookform/resolvers/zod";
import {
  OakBox,
  oakDefaultTheme,
  OakFlex,
  OakLink,
  OakMaxWidth,
  OakP,
  OakPrimaryButton,
  OakRadioButton,
  OakRadioGroup,
  OakSpan,
  OakThemeProvider,
} from "@oaknational/oak-components";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import Logo from "@/components/AppComponents/Logo";
import FieldError from "@/components/SharedComponents/FieldError";
import { resolveOakHref } from "@/common-lib/urls";

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
    <OakThemeProvider theme={oakDefaultTheme}>
      <OakFlex $background={"bg-decorative1-main"}>
        <OakMaxWidth $justifyContent={"center"} $height={"100vh"}>
          <OakFlex
            $flexDirection="column"
            $width="all-spacing-20"
            $gap="space-between-m"
          >
            <OakFlex
              $flexDirection="column"
              $alignItems="flex-start"
              $pa="inner-padding-xl3"
              $background={"white"}
              $dropShadow="drop-shadow-standard"
              $borderRadius="border-radius-s"
              as="form"
              onSubmit={
                (event) => void handleSubmit(onFormSubmit)(event) // https://github.com/orgs/react-hook-form/discussions/8622}
              }
            >
              <Logo height={48} width={104} variant="with text" />
              <OakFlex $flexDirection={"column"} role={"fieldset"}>
                <OakSpan
                  role="legend"
                  $mb={"space-between-s"}
                  $mt={"space-between-m"}
                  $font="heading-light-6"
                >
                  Do you work in a school?
                </OakSpan>
                <FieldError withoutMarginBottom id={"onboarding-error"}>
                  {formState.errors.worksInSchool?.message}
                </FieldError>
                <OakBox $pv={"inner-padding-xl"}>
                  <OakRadioGroup
                    onChange={(value) =>
                      setWorksInSchool(value.target.value === "yes")
                    }
                    $flexDirection={"column"}
                    name={"Do you work in a school?"}
                  >
                    <OakRadioButton id="option-1" label="Yes" value="yes" />
                    <OakRadioButton id="option-2" label="No" value="no" />
                  </OakRadioGroup>
                </OakBox>

                <OakPrimaryButton
                  disabled={Boolean(formState.errors.worksInSchool)}
                  element={!formState.isValid ? "button" : "a"}
                  href={resolveOakHref({
                    page: worksInSchool
                      ? "onboarding-school-selection"
                      : "onboarding-role-selection",
                  })}
                  type="submit"
                >
                  Continue
                </OakPrimaryButton>
              </OakFlex>
            </OakFlex>
            <OakFlex $ph={"inner-padding-xl3"} $justifyContent={"center"}>
              <OakP $font="body-2">
                Need help{" "}
                <OakLink
                  color="black"
                  href={resolveOakHref({ page: "contact" })}
                >
                  Contact us
                </OakLink>
              </OakP>
            </OakFlex>
          </OakFlex>
        </OakMaxWidth>
      </OakFlex>
    </OakThemeProvider>
  );
};

export default OnboardingView;
