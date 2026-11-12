import {
  Control,
  Controller,
  UseFormHandleSubmit,
  UseFormStateReturn,
  UseFormTrigger,
} from "react-hook-form";
import { BaseSyntheticEvent, ChangeEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  OnboardingFormValues,
  isSchoolSelectData,
} from "./OnboardingForm.schema";
import {
  getSubscriptionStatus,
  onboardUser,
  setOnboardingLocalStorage,
  submitOnboardingHubspotData,
} from "./onboardingActions";
import {
  decodeOnboardingDataQueryParam,
  encodeOnboardingDataQueryParam,
} from "./onboardingDataQueryParam";

import Logo from "@/components/AppComponents/Logo";
import { resolveOakHref } from "@/common-lib/urls";
import useAnalytics from "@/context/Analytics/useAnalytics";
import { useTeacherBrowseAnalytics } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";
import { collectOnboardingTrackingProps } from "@/context/TeacherBrowseAnalytics/utils/collectOnboardingTrackingProps";
import useUtmParams from "@/hooks/useUtmParams";
import toSafeRedirect from "@/common-lib/urls/toSafeRedirect";
import getHubspotUserToken from "@/browser-lib/hubspot/forms/getHubspotUserToken";
import { useOakNotificationsContext } from "@/context/OakNotifications/useOakNotificationsContext";

const OnboardingForm = ({
  forceHideNewsletterSignUp,
  ...props
}: {
  children: React.ReactNode;
  handleSubmit: UseFormHandleSubmit<OnboardingFormValues>;
  formState: UseFormStateReturn<OnboardingFormProps>;
  heading: string;
  subheading?: string;
  secondaryButton?: (isSubmitting: boolean) => React.ReactNode;
  canSubmit: boolean;
  onSubmit?: () => void;
  control: Control<OnboardingFormValues>;
  trigger: UseFormTrigger<OnboardingFormValues>;
  forceHideNewsletterSignUp?: boolean;
  continueButtonDescription?: string;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const utmParams = useUtmParams();
  const { posthogDistinctId } = useAnalytics();
  const { userOnboardingCompleted, userOnboardingProgressed } =
    useTeacherBrowseAnalytics((store) => store.track);
  const { user } = useUser();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const localStorageForDownloads = useLocalStorageForDownloads();
  const [userSubscribedInHubspot, setUserSubscribedInHubspot] = useState<
    boolean | undefined
  >(undefined);
  const { setCurrentToastProps } = useOakNotificationsContext();
  // Accumulate onboarding data from all steps
  const collectedOnboardingData = decodeOnboardingDataQueryParam(searchParams);

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
    data: OnboardingFormValues,
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
    const query = encodeOnboardingDataQueryParam(
      searchParams,
      latestOnboardingData,
    );

    if ("worksInSchool" in data) {
      user &&
        userOnboardingProgressed(
          collectOnboardingTrackingProps(
            user,
            latestOnboardingData,
            event?.nativeEvent,
          ),
        );
      router.push(
        `${resolveOakHref({
          page: data.worksInSchool
            ? "onboarding-school-selection"
            : "onboarding-role-selection",
        })}?${query}`,
      );
    } else if (isSchoolSelectData(data) && showNewsletterSignUp) {
      user &&
        userOnboardingProgressed(
          collectOnboardingTrackingProps(
            user,
            latestOnboardingData,
            event?.nativeEvent,
          ),
        );
      router.push(
        `${resolveOakHref({
          page: "onboarding-use-of-oak",
        })}?${query}`,
      );
    } else {
      setIsSubmitting(true);
      const isTeacher = "school" in data || "manualSchoolName" in data;
      const userSubscribed =
        userSubscribedInHubspot ||
        ("newsletterSignUp" in data && data.newsletterSignUp);
      const userEmail = user?.emailAddresses[0]?.emailAddress;

      await setOnboardingLocalStorage({
        localStorageForDownloads,
        data,
        userEmail,
      });

      const hubspotSubmissionSucceeded = await submitOnboardingHubspotData({
        hutk: getHubspotUserToken(),
        utmParams,
        data,
        userSubscribed,
        posthogDistinctId,
        userEmail,
      });

      if (hubspotSubmissionSucceeded) {
        try {
          await onboardUser({ isTeacher });
          user &&
            posthogDistinctId &&
            userOnboardingCompleted(
              collectOnboardingTrackingProps(
                user,
                latestOnboardingData,
                event?.nativeEvent,
              ),
            );

          await user?.reload();
        } catch {
          setSubmitError("Something went wrong. Please try again.");
          setIsSubmitting(false);
          return;
        }
      } else {
        setCurrentToastProps({
          variant: "error",
          message:
            "Sorry, something went wrong with your sign-up. You’ll need to complete account setup before you can access some features.",
          autoDismiss: false,
          showIcon: true,
        });
      }

      // Return the user to the page they originally arrived from
      // or to the home page as a fallback
      router.push(
        toSafeRedirect(
          searchParams?.get("returnTo") ?? "/",
          new URL(typeof window !== "undefined" ? window.location.origin : "/"),
        ) ?? "/",
      );
    }
  };

  return (
    <OakFlex
      $flexDirection="column"
      $gap="spacing-24"
      $justifyContent={"center"}
      $alignSelf={"start"}
    >
      <OakFlex
        $flexDirection="column"
        $alignItems="flex-start"
        $gap="spacing-40"
        $pa="spacing-40"
        $dropShadow={[null, "drop-shadow-standard"]}
        $borderRadius="border-radius-m2"
        $background={"bg-primary"}
        as="form"
        noValidate
        onSubmit={
          (event: React.FormEvent<HTMLFormElement>) => {
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
            $mb={props.subheading ? "spacing-8" : "spacing-24"}
            $pa="spacing-0"
          >
            {props.heading}
          </OakSpan>
          <OakFlex $gap="spacing-24" $flexDirection={"column"} $width="100%">
            {props.subheading && (
              <OakP $font="body-2" $color="text-subdued" $mb={"spacing-16"}>
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
                  $mt="spacing-24"
                />
              )}
            </OakBox>
            <OakBox>{props.children}</OakBox>
            <OakFlex $pv="spacing-24" $gap="spacing-12" $flexDirection="column">
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
