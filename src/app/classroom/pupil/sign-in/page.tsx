"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AuthCookieKeys,
  GoogleSignInView,
} from "@oaknational/google-classroom-addon/ui";

import { googleClassroomApi } from "@/browser-lib/google-classroom";
import useAnalytics from "@/context/Analytics/useAnalytics";
import { getClientEnvironment } from "@/components/GoogleClassroom/getClientEnvironment";
import {
  AnalyticsUseCase,
  ComponentType,
  EngagementIntent,
  EventVersion,
  Platform,
  Product,
} from "@/browser-lib/avo/Avo";
import {
  clearClassroomAddOnOpened,
  markClassroomAddOnNavigation,
  trackClassroomAddOnOpenedOnce,
} from "@/browser-lib/google-classroom/classroomAddonTracking";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { track } = useAnalytics();

  const clientEnvironment = getClientEnvironment();
  const loginHint = searchParams?.get("login_hint") ?? null;

  // We only want to fire the event once either from sign up page or from pupil experience
  useEffect(() => {
    window.addEventListener("pagehide", clearClassroomAddOnOpened);
    return () =>
      window.removeEventListener("pagehide", clearClassroomAddOnOpened);
  }, []);

  useEffect(() => {
    trackClassroomAddOnOpenedOnce(() => {
      track.classroomAddOnOpened({
        platform: Platform.GOOGLE_CLASSROOM,
        product: Product.GOOGLE_CLASSROOM_ADDON,
        engagementIntent: EngagementIntent.USE,
        componentType: ComponentType.PAGE_VIEW,
        eventVersion: EventVersion["2_0_0"],
        analyticsUseCase: AnalyticsUseCase.PUPIL,
        clientEnvironment,
      });
    });
  }, [clientEnvironment, track]);

  const getGoogleSignInLink = () => {
    track.classroomSignInStarted({
      platform: Platform.GOOGLE_CLASSROOM,
      product: Product.GOOGLE_CLASSROOM_ADDON,
      analyticsUseCase: AnalyticsUseCase.PUPIL,
      googleLoginHint: loginHint,
      clientEnvironment,
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

    track.classroomSignInCompleted({
      platform: Platform.GOOGLE_CLASSROOM,
      product: Product.GOOGLE_CLASSROOM_ADDON,
      analyticsUseCase: AnalyticsUseCase.PUPIL,
      googleLoginHint: loginHint,
      subscribeToNewsletter: null,
      clientEnvironment,
    });

    if (programmeSlug && unitSlug && lessonSlug) {
      // setTimeout is needed to ensure tracking event is sent before navigation
      setTimeout(() => {
        markClassroomAddOnNavigation();
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
