import {
  OakFlex,
  OakHeading,
  OakP,
  OakPrimaryButton,
} from "@oaknational/oak-components";
import { UseFormHandleSubmit, UseFormStateReturn } from "react-hook-form";

import Logo from "@/components/AppComponents/Logo";
import OwaLink from "@/components/SharedComponents/OwaLink";
import { SchoolSelectFormProps } from "@/components/TeacherViews/Onboarding/SchoolSelection/SchoolSelection.view";
import { RoleSelectFormProps } from "@/components/TeacherViews/Onboarding/RoleSelection/RoleSelection.view";

type OnboardingFormProps = SchoolSelectFormProps | RoleSelectFormProps;

const OnboardingForm = (props: {
  children: React.ReactNode;
  handleSubmit: UseFormHandleSubmit<OnboardingFormProps>;
  formState: UseFormStateReturn<OnboardingFormProps>;
  heading: string;
}) => {
  const onFormSubmit = async (data: OnboardingFormProps) => {
    // TODO: something with this data
    console.log("onboarding form values: ", data);
  };

  // TODO: tidy this
  const continueDisabled =
    (props.formState as UseFormStateReturn<SchoolSelectFormProps>).errors
      ?.school !== undefined &&
    (props.formState as UseFormStateReturn<RoleSelectFormProps>).errors
      ?.role !== undefined;

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
          (event) => void props.handleSubmit(onFormSubmit)(event) // https://github.com/orgs/react-hook-form/discussions/8622}
        }
      >
        <Logo height={48} width={104} variant="with text" />
        <OakHeading tag="h2" $font="heading-light-5">
          {props.heading}
        </OakHeading>
        {props.children}
        <OakPrimaryButton
          disabled={continueDisabled}
          width="100%"
          type="submit"
        >
          Continue
        </OakPrimaryButton>
      </OakFlex>

      <OakP $font="body-2" color="text-primary" $textAlign="center">
        By continuing you agree to{" "}
        <OwaLink
          page="legal"
          legalSlug="terms-and-conditions"
          $isInline
          htmlAnchorProps={{
            target: "_blank",
            "aria-label": `Terms and conditions (opens in a new tab)"
          }`,
          }}
        >
          Oak's terms & conditions
        </OwaLink>{" "}
        and{" "}
        <OwaLink
          page="legal"
          legalSlug="privacy-policy"
          $isInline
          htmlAnchorProps={{
            target: "_blank",
            "aria-label": "Privacy policy (opens in a new tab)",
          }}
        >
          privacy policy
        </OwaLink>
        .
      </OakP>
      <OakP $font="body-2" color="text-primary" $textAlign="center">
        Need help?{" "}
        <OwaLink
          page="contact"
          $isInline
          htmlAnchorProps={{
            target: "_blank",
            "aria-label": `Contact us (opens in a new tab)"
          }`,
          }}
        >
          {" "}
          Contact us
        </OwaLink>
        .
      </OakP>
    </OakFlex>
  );
};

export default OnboardingForm;
