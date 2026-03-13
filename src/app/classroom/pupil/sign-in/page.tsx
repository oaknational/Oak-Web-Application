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

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { track } = useAnalytics();

  const clientEnvironment = getClientEnvironment();
  const loginHint = searchParams?.get("login_hint") ?? null;

  const getGoogleSignInLink = () => {
    track.classroomSignInStarted({
      platform: "google-classroom",
      product: "google classroom addon",
      analyticsUseCase: "Pupil",
      googleLoginHint: loginHint,
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
      platform: "google-classroom",
      product: "google classroom addon",
      analyticsUseCase: "Pupil",
      googleLoginHint: loginHint,
      subscribeToNewsletter: null,
      clientEnvironment,
    });

    if (programmeSlug && unitSlug && lessonSlug) {
      router.push(
        `/pupils/programmes/${programmeSlug}/units/${unitSlug}/lessons/${lessonSlug}?${currentParams}`,
      );
    }
    // when we have classroom 404/500 pages, we should redirect to those
  };

  useEffect(() => {
    track.classroomAddOnOpened({
      platform: "google-classroom",
      product: "google classroom addon",
      engagementIntent: "use",
      componentType: "page view",
      eventVersion: "2.0.0",
      analyticsUseCase: "Pupil",
      clientEnvironment,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
