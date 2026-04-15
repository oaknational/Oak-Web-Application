"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AuthCookieKeys,
  GoogleSignInView,
} from "@oaknational/google-classroom-addon/ui";

import { googleClassroomApi } from "@/browser-lib/google-classroom";
import { AnalyticsUseCase } from "@/browser-lib/avo/Avo";
import { useGoogleClassroomAnalytics } from "@/components/GoogleClassroom/useGoogleClassroomAnalytics";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const trackAddOnOpenedOnce = useGoogleClassroomAnalytics(
    (state) => state.trackAddOnOpenedOnce,
  );
  const trackSignInStarted = useGoogleClassroomAnalytics(
    (state) => state.trackSignInStarted,
  );
  const trackSignInCompleted = useGoogleClassroomAnalytics(
    (state) => state.trackSignInCompleted,
  );
  const markAddOnNavigation = useGoogleClassroomAnalytics(
    (state) => state.markAddOnNavigation,
  );
  const clearAddOnOpenedFlag = useGoogleClassroomAnalytics(
    (state) => state.clearAddOnOpenedFlag,
  );

  // We only want to fire the event once either from sign up page or from pupil experience
  useEffect(() => {
    window.addEventListener("pagehide", clearAddOnOpenedFlag);
    return () => window.removeEventListener("pagehide", clearAddOnOpenedFlag);
  }, [clearAddOnOpenedFlag]);

  useEffect(() => {
    trackAddOnOpenedOnce({
      analyticsUseCase: AnalyticsUseCase.PUPIL,
    });
  }, [trackAddOnOpenedOnce]);

  const getGoogleSignInLink = () => {
    trackSignInStarted({
      analyticsUseCase: AnalyticsUseCase.PUPIL,
    });
    return googleClassroomApi.getGoogleSignInUrl(
      searchParams?.get("login_hint") ?? null,
      undefined,
      true,
    );
  };

  const onSuccessfulSignIn = () => {
    const programmeSlug = searchParams?.get("programmeSlug");
    const unitSlug = searchParams?.get("unitSlug");
    const lessonSlug = searchParams?.get("lessonSlug");
    const currentParams = searchParams?.toString() ?? "";

    trackSignInCompleted({
      analyticsUseCase: AnalyticsUseCase.PUPIL,
      subscribeToNewsletter: null,
    });

    if (programmeSlug && unitSlug && lessonSlug) {
      // setTimeout is needed to ensure tracking event is sent before navigation
      setTimeout(() => {
        markAddOnNavigation();
        router.push(
          `/pupils/programmes/${programmeSlug}/units/${unitSlug}/lessons/${lessonSlug}?${currentParams}`,
        );
      }, 300);
    }
    // when we have classroom 404/500 pages, we should redirect to those
  };

  return (
    <GoogleSignInView
      getGoogleSignInLink={getGoogleSignInLink}
      onSuccessfulSignIn={onSuccessfulSignIn}
      privacyPolicyUrl={"/legal/privacy-policy"}
      showMailingListOption={false}
      cookieKeys={[
        AuthCookieKeys.PupilAccessToken,
        AuthCookieKeys.PupilSession,
      ]}
    />
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInContent />
    </Suspense>
  );
}
