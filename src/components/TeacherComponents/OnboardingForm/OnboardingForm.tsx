import {
  Control,
  Controller,
  UseFormHandleSubmit,
  UseFormStateReturn,
  UseFormTrigger,
} from "react-hook-form";
import { ChangeEvent } from "react";
import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";

import { OnboardingFormProps } from "./OnboardingForm.schema";

import {
  OakCheckBox,
  OakFlex,
  OakLink,
  OakP,
  OakPrimaryButton,
  OakSpan,
} from "@oaknational/oak-components";
import Logo from "@/components/AppComponents/Logo";
import { resolveOakHref } from "@/common-lib/urls";
import useAnalytics from "@/context/Analytics/useAnalytics";
import useUtmParams from "@/hooks/useUtmParams";
import getHubspotUserToken from "@/browser-lib/hubspot/forms/getHubspotUserToken";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import { getHubspotOnboardingFormPayload } from "@/browser-lib/hubspot/forms/getHubspotFormPayloads";
import { hubspotSubmitForm } from "@/browser-lib/hubspot/forms";
import OakError from "@/errors/OakError";

const OnboardingForm = ({
  showNewsletterSignUp = true,
  ...props
}: {
  children: React.ReactNode;
  handleSubmit: UseFormHandleSubmit<OnboardingFormProps>;
  formState: UseFormStateReturn<OnboardingFormProps>;
  heading: string;
  canSubmit: boolean;
  onSubmit?: () => void;
  control: Control<OnboardingFormProps>;
  trigger: UseFormTrigger<OnboardingFormProps>;
  showNewsletterSignUp?: boolean;
}) => {
  const router = useRouter();
  const hutk = getHubspotUserToken();
  const utmParams = useUtmParams();
  const { posthogDistinctId } = useAnalytics();
  const { user } = useUser();

  const onFormSubmit = async (data: OnboardingFormProps) => {
    if ("worksInSchool" in data) {
      router.push(
        resolveOakHref({
          page: data.worksInSchool
            ? "onboarding-school-selection"
            : "onboarding-role-selection",
        }),
      );
    } else {
      const hubspotFormId = getBrowserConfig("hubspotOnboardingFormId");
      const userEmail = user?.primaryEmailAddress?.emailAddress;
      const hubspotFormPayload = getHubspotOnboardingFormPayload({
        hutk,
        data: {
          ...utmParams,
          ...data,
          oakUserId: posthogDistinctId,
          email: userEmail,
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
    }
  };

  return (
    <OakFlex
      $flexDirection="column"
      $gap="space-between-m"
      $justifyContent={"center"}
      $alignSelf={"start"}
    >
      <OakFlex
        $flexDirection="column"
        $alignItems="flex-start"
        $gap="all-spacing-8"
        $pa="inner-padding-xl3"
        $dropShadow="drop-shadow-standard"
        $borderRadius="border-radius-s"
        $background={"white"}
        as="form"
        onSubmit={
          (event) => void props.handleSubmit(onFormSubmit)(event) // https://github.com/orgs/react-hook-form/discussions/8622}
        }
      >
        <Logo height={48} width={104} variant="with text" />
        <OakFlex
          $gap="all-spacing-8"
          $flexDirection={"column"}
          role={"fieldset"}
        >
          <OakSpan role="legend" id={"form-legend"} $font="heading-light-5">
            {props.heading}
          </OakSpan>
          {props.children}
          <OakPrimaryButton
            disabled={!props.canSubmit}
            width="100%"
            type="submit"
            onClick={props.onSubmit}
          >
            Continue
          </OakPrimaryButton>
          {showNewsletterSignUp && (
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
          )}
        </OakFlex>
      </OakFlex>

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
