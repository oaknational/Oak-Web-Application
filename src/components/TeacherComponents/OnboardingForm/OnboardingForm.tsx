import {
  Control,
  Controller,
  UseFormHandleSubmit,
  UseFormStateReturn,
  UseFormTrigger,
} from "react-hook-form";
import { BaseSyntheticEvent, ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";
import {
  OakBox,
  OakCheckBox,
  OakFieldset,
  OakFlex,
  OakInlineBanner,
  OakP,
  OakPrimaryButton,
  OakSpan,
} from "@oaknational/oak-components";

import useLocalStorageForDownloads from "../hooks/downloadAndShareHooks/useLocalStorageForDownloads";

import {
  OnboardingFormProps,
  isSchoolSelectData,
} from "./OnboardingForm.schema";
import {
  getSubscriptionStatus,
  onboardUser,
  setOnboardingLocalStorage,
  submitOnboardingHubspotData,
  collectOnboardingTrackingProps,
} from "./onboardingActions";
import {
  decodeOnboardingDataQueryParam,
  encodeOnboardingDataQueryParam,
} from "./onboardingDataQueryParam";

import Logo from "@/components/AppComponents/Logo";
import { resolveOakHref } from "@/common-lib/urls";
import useAnalytics from "@/context/Analytics/useAnalytics";
import useUtmParams from "@/hooks/useUtmParams";
import toSafeRedirect from "@/common-lib/urls/toSafeRedirect";
import getHubspotUserToken from "@/browser-lib/hubspot/forms/getHubspotUserToken";

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
  continueButtonDescription?: string;
}) => {
  const router = useRouter();
  const utmParams = useUtmParams();
  const { posthogDistinctId } = useAnalytics();
  const { user } = useUser();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const localStorageForDownloads = useLocalStorageForDownloads();
  const [userSubscribedInHubspot, setUserSubscribedInHubspot] = useState<
    boolean | undefined
  >(undefined);
  const { track } = useAnalytics();
  // Accumulate onboarding data from all steps
  const collectedOnboardingData = decodeOnboardingDataQueryParam(router.query);

  useEffect(() => {
    if (forceHideNewsletterSignUp) {
      return;
    }
    if (user?.emailAddresses[0]) {
      getSubscriptionStatus(setUserSubscribedInHubspot);
    }
  }, [user, forceHideNewsletterSignUp]);

  const showNewsletterSignUp =
    userSubscribedInHubspot === false && forceHideNewsletterSignUp !== true;

  const onFormSubmit = async (
    data: OnboardingFormProps,
    event?: BaseSyntheticEvent,
  ) => {
    if (isSubmitting && !props.canSubmit) {
      return;
    }

    // Merge the incoming data into our accumlated onboarding data
    // we'll use this to update the tracking state
    const latestOnboardingData = {
      ...collectedOnboardingData,
      ...data,
    };
    const newQuery = encodeOnboardingDataQueryParam(
      router.query,
      latestOnboardingData,
    );

    if ("worksInSchool" in data) {
      user &&
        posthogDistinctId &&
        track.userOnboardingProgressed(
          collectOnboardingTrackingProps(
            posthogDistinctId,
            user,
            latestOnboardingData,
            event?.nativeEvent,
          ),
        );
      router.push({
        pathname: resolveOakHref({
          page: data.worksInSchool
            ? "onboarding-school-selection"
            : "onboarding-role-selection",
        }),
        query: newQuery,
      });
    } else if (isSchoolSelectData(data) && showNewsletterSignUp) {
      user &&
        posthogDistinctId &&
        track.userOnboardingProgressed(
          collectOnboardingTrackingProps(
            posthogDistinctId,
            user,
            latestOnboardingData,
            event?.nativeEvent,
          ),
        );
      router.push({
        pathname: resolveOakHref({
          page: "onboarding-use-of-oak",
        }),
        query: newQuery,
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

      const userSubscribed =
        userSubscribedInHubspot ||
        ("newsletterSignUp" in data && data.newsletterSignUp);

      const userEmail = user?.emailAddresses[0]?.emailAddress;

      await setOnboardingLocalStorage({
        localStorageForDownloads,
        data,
        userEmail,
      });

      await submitOnboardingHubspotData({
        hutk: getHubspotUserToken(),
        utmParams,
        data,
        userSubscribed,
        posthogDistinctId,
        userEmail,
      });

      user &&
        posthogDistinctId &&
        track.userOnboardingCompleted(
          collectOnboardingTrackingProps(
            posthogDistinctId,
            user,
            latestOnboardingData,
            event?.nativeEvent,
          ),
        );

      // Return the user to the page they originally arrived from
      // or to the home page as a fallback
      router.push(
        toSafeRedirect(
          router.query.returnTo?.toString() ?? "/",
          new URL(typeof window !== "undefined" ? window.location.origin : "/"),
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
          (event) => {
            if (props.canSubmit) {
              props.handleSubmit(onFormSubmit)(event);
            } else {
              event.preventDefault();
            }
          } // https://github.com/orgs/react-hook-form/discussions/8622}
        }
      >
        <Logo height={48} width={104} variant="with text" />
        <OakFieldset $width="100%">
          <OakSpan
            id={"form-legend"}
            $font="heading-6"
            as="legend"
            $mb={props.subheading ? "space-between-ssx" : "space-between-m"}
            $pa="inner-padding-none"
          >
            {props.heading}
          </OakSpan>
          <OakFlex
            $gap="space-between-m"
            $flexDirection={"column"}
            $width="100%"
          >
            {props.subheading && (
              <OakP
                $font="body-2"
                $color="text-subdued"
                $mb={"space-between-s"}
              >
                {props.subheading}
              </OakP>
            )}
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
                disabled={isSubmitting}
                width="100%"
                type="submit"
                onClick={props.onSubmit}
                name="continue"
                aria-description={
                  props.continueButtonDescription ?? submitError ?? undefined
                }
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
                  const onChangeHandler = (
                    e: ChangeEvent<HTMLInputElement>,
                  ) => {
                    onChange(e.target.checked);
                    props.trigger("newsletterSignUp");
                  };
                  return (
                    <OakCheckBox
                      checked={value ?? false}
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
          </OakFlex>{" "}
        </OakFieldset>
      </OakFlex>
    </OakFlex>
  );
};

export default OnboardingForm;
