import {
  OakCheckBox,
  OakFlex,
  OakHeading,
  OakP,
  OakPrimaryButton,
} from "@oaknational/oak-components";
import {
  Control,
  Controller,
  UseFormHandleSubmit,
  UseFormStateReturn,
  UseFormTrigger,
} from "react-hook-form";
import { ChangeEvent } from "react";

import { OnboardingFormProps } from "./OnboardingForm.schema";

import Logo from "@/components/AppComponents/Logo";
import OwaLink from "@/components/SharedComponents/OwaLink";

const OnboardingForm = (props: {
  children: React.ReactNode;
  handleSubmit: UseFormHandleSubmit<OnboardingFormProps>;
  formState: UseFormStateReturn<OnboardingFormProps>;
  heading: string;
  continueDisabled: boolean;
  onSubmit?: () => void;
  control: Control<OnboardingFormProps>;
  trigger: UseFormTrigger<OnboardingFormProps>;
}) => {
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
          (event) => void props.handleSubmit(onFormSubmit)(event) // https://github.com/orgs/react-hook-form/discussions/8622}
        }
      >
        <Logo height={48} width={104} variant="with text" />
        <OakHeading tag="h2" $font="heading-light-5">
          {props.heading}
        </OakHeading>
        {props.children}
        <OakPrimaryButton
          disabled={props.continueDisabled}
          width="100%"
          type="submit"
          onClick={props.onSubmit}
        >
          Continue
        </OakPrimaryButton>
        <Controller
          control={props.control}
          name="newsletterSignUp"
          render={({ field: { value, onChange, name, onBlur } }) => {
            const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
              onChange(e.target.checked);
              props.trigger();
            };
            return (
              <OakCheckBox
                checked={value}
                name={name}
                onBlur={onBlur}
                onChange={onChangeHandler}
                value="Sign up to receive helpful content via email. Unsubscribe at any
                    time."
                id="newsletterSignUp"
              />
            );
          }}
        />
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
