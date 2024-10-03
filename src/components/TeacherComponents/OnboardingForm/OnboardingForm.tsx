import {
  Control,
  Controller,
  UseFormHandleSubmit,
  UseFormStateReturn,
  UseFormTrigger,
} from "react-hook-form";
import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";
import {
  OakBox,
  OakCheckBox,
  OakFlex,
  OakInlineBanner,
  OakLink,
  OakP,
  OakPrimaryButton,
  OakSpan,
} from "@oaknational/oak-components";

import {
  OnboardingFormProps,
  isSchoolSelectData,
} from "./OnboardingForm.schema";
import {
  getSubscriptionStatus,
  onboardUser,
  onboardUserToHubspot,
} from "./onboardingActions";
import { getQueryParamsFromOnboardingFormData } from "./getQueryParamsFromOnboardingFormData";

import Logo from "@/components/AppComponents/Logo";
import { resolveOakHref } from "@/common-lib/urls";
import useAnalytics from "@/context/Analytics/useAnalytics";
import useUtmParams from "@/hooks/useUtmParams";
import toSafeRedirect from "@/common-lib/urls/toSafeRedirect";

const OnboardingForm = ({
  forceHideNewsletterSignUp,
  ...props
}: {
  children: React.ReactNode;
  handleSubmit: UseFormHandleSubmit<OnboardingFormProps>;
  formState: UseFormStateReturn<OnboardingFormProps>;
  heading: string;
  subheading?: string;
  secondaryButton?: (isSubmitting: boolean) => React.ReactNode;
  canSubmit: boolean;
  onSubmit?: () => void;
  control: Control<OnboardingFormProps>;
  trigger: UseFormTrigger<OnboardingFormProps>;
  forceHideNewsletterSignUp?: boolean;
}) => {
  const router = useRouter();
  const utmParams = useUtmParams();
  const { posthogDistinctId } = useAnalytics();
  const { user } = useUser();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userRegisteredInHubspot, setUserRegisteredinHubspot] = useState<
    boolean | undefined
  >(undefined);

  useEffect(() => {
    if (forceHideNewsletterSignUp) {
      return;
    }
    if (user?.emailAddresses[0]) {
      const email = String(user.emailAddresses[0].emailAddress);
      getSubscriptionStatus(email, setUserRegisteredinHubspot);
    }
  }, [user, forceHideNewsletterSignUp]);

  const showNewsletterSignUp =
    userRegisteredInHubspot === false && forceHideNewsletterSignUp !== true;

  const onFormSubmit = async (data: OnboardingFormProps) => {
    if (isSubmitting) {
      return;
    }

    if ("worksInSchool" in data) {
      router.push({
        pathname: resolveOakHref({
          page: data.worksInSchool
            ? "onboarding-school-selection"
            : "onboarding-role-selection",
        }),
        query: router.query,
      });
    } else if (isSchoolSelectData(data) && showNewsletterSignUp) {
      const encodedQueryData = getQueryParamsFromOnboardingFormData(
        data,
        router.query,
      );

      router.push({
        pathname: resolveOakHref({
          page: "onboarding-use-of-oak",
        }),
        query: encodedQueryData,
      });
    } else {
      setIsSubmitting(true);
      const isTeacher = "school" in data || "manualSchoolName" in data;

      try {
        await onboardUser({ isTeacher });
        await user?.reload();
      } catch (error) {
        setSubmitError("Something went wrong. Please try again.");
        setIsSubmitting(false);
        // No point in proceeding to hubspot sign-up if onboarding failed
        return;
      }

      await onboardUserToHubspot({
        ...utmParams,
        ...data,
        oakUserId: posthogDistinctId,
        email: user?.primaryEmailAddress?.emailAddress,
      });

      // Return the user to the page they originally arrived from
      // or to the home page as a fallback
      router.push(
        toSafeRedirect(
          router.query.returnTo?.toString() ?? "/",
          new URL(location.origin),
        ) ?? "/",
      );
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
        $dropShadow={[null, "drop-shadow-standard"]}
        $borderRadius="border-radius-m2"
        $background={"white"}
        as="form"
        noValidate
        onSubmit={
          (event) => void props.handleSubmit(onFormSubmit)(event) // https://github.com/orgs/react-hook-form/discussions/8622}
        }
      >
        <Logo height={48} width={104} variant="with text" />
        <OakFlex
          $gap="space-between-m"
          $flexDirection={"column"}
          $width="100%"
          role={"fieldset"}
        >
          <OakFlex
            $flexDirection="column"
            $gap="space-between-ssx"
            $pb={props.subheading ? "inner-padding-m" : "inner-padding-none"}
          >
            <OakSpan role="legend" id={"form-legend"} $font="heading-6">
              {props.heading}
            </OakSpan>
            {props.subheading && (
              <OakP $font="body-2" $color="text-subdued">
                {props.subheading}
              </OakP>
            )}
          </OakFlex>
          <OakBox aria-live="polite" $display="contents">
            {submitError && (
              <OakInlineBanner
                isOpen
                icon="error"
                type="error"
                message={submitError}
                $width="100%"
                $mt="space-between-m"
              />
            )}
          </OakBox>
          <OakBox>{props.children}</OakBox>
          <OakFlex
            $pv="inner-padding-xl"
            $gap="space-between-xs"
            $flexDirection="column"
          >
            <OakPrimaryButton
              disabled={!props.canSubmit || isSubmitting}
              width="100%"
              type="submit"
              onClick={props.onSubmit}
              aria-description={submitError ?? undefined}
            >
              Continue
            </OakPrimaryButton>
            {props.secondaryButton?.(isSubmitting)}
          </OakFlex>
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
                    value="Sign up for our latest resources and updates by email. Unsubscribe at any time"
                    id="newsletterSignUp"
                  />
                );
              }}
            />
          )}
        </OakFlex>
      </OakFlex>

      <OakBox
        as="p"
        $font="body-2"
        color="text-primary"
        $textAlign="center"
        $pb="inner-padding-s"
      >
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
      </OakBox>
    </OakFlex>
  );
};

export default OnboardingForm;
