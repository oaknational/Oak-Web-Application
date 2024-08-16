import {
  OakCheckBox,
  OakFlex,
  OakHeading,
  OakLink,
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
import { resolveOakHref } from "@/common-lib/urls";
import useAnalytics from "@/context/Analytics/useAnalytics";
import useUtmParams from "@/hooks/useUtmParams";
import getHubspotUserToken from "@/browser-lib/hubspot/forms/getHubspotUserToken";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import { getHubspotOnboardingFormPayload } from "@/browser-lib/hubspot/forms/getHubspotFormPayloads";
import { hubspotSubmitForm } from "@/browser-lib/hubspot/forms";
import OakError from "@/errors/OakError";

const OnboardingForm = (props: {
  children: React.ReactNode;
  handleSubmit: UseFormHandleSubmit<OnboardingFormProps>;
  formState: UseFormStateReturn<OnboardingFormProps>;
  heading: string;
  canSubmit: boolean;
  onSubmit?: () => void;
  control: Control<OnboardingFormProps>;
  trigger: UseFormTrigger<OnboardingFormProps>;
}) => {
  const hutk = getHubspotUserToken();
  const utmParams = useUtmParams();
  const { posthogDistinctId } = useAnalytics();

  const onFormSubmit = async (data: OnboardingFormProps) => {
    const hubspotFormId = getBrowserConfig("hubspotOnboardingFormId");
    const hubspotFormPayload = getHubspotOnboardingFormPayload({
      hutk,
      data: {
        ...utmParams,
        ...data,
        oakUserId: posthogDistinctId,
        email: "TODO: get email from user account",
      },
    });

    try {
      await hubspotSubmitForm({
        hubspotFormId,
        payload: hubspotFormPayload,
      });
    } catch (error) {
      if (error instanceof OakError) {
        reportError(error);
      } else {
        reportError(
          new OakError({
            code: "hubspot/unknown",
            originalError: error,
          }),
        );
      }
    }
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
          disabled={!props.canSubmit}
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
              props.trigger("newsletterSignUp");
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
        <OakLink
          href={resolveOakHref({
            page: "legal",
            legalSlug: "terms-and-conditions",
          })}
          target="_blank"
          aria-label="Terms and conditions (opens in a new tab)"
        >
          Oak's terms & conditions
        </OakLink>{" "}
        and{" "}
        <OakLink
          href={resolveOakHref({
            page: "legal",
            legalSlug: "privacy-policy",
          })}
          target="_blank"
          aria-label="Privacy policy (opens in a new tab)"
        >
          privacy policy
        </OakLink>
        .
      </OakP>
      <OakP $font="body-2" color="text-primary" $textAlign="center">
        Need help?{" "}
        <OakLink
          href={resolveOakHref({
            page: "contact",
          })}
        >
          {" "}
          Contact us
        </OakLink>
        .
      </OakP>
    </OakFlex>
  );
};

export default OnboardingForm;
