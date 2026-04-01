"use client";

import { Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GoogleSignInView } from "@oaknational/google-classroom-addon/ui";
import { OakBox } from "@oaknational/oak-components";

import { googleClassroomApi } from "@/browser-lib/google-classroom";
import { AnalyticsUseCase } from "@/browser-lib/avo/Avo";
import { useGoogleClassroomAnalytics } from "@/components/GoogleClassroom/useGoogleClassroomAnalytics";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginHint = searchParams?.get("login_hint") ?? null;
  const trackSignInStarted = useGoogleClassroomAnalytics(
    (state) => state.trackSignInStarted,
  );
  const trackSignInCompleted = useGoogleClassroomAnalytics(
    (state) => state.trackSignInCompleted,
  );

  const subscribeToNewsletterRef = useRef<boolean>(false);

  const getGoogleSignInLink = (subscribeToNewsletter?: boolean) => {
    subscribeToNewsletterRef.current = subscribeToNewsletter ?? false;
    trackSignInStarted({
      analyticsUseCase: AnalyticsUseCase.TEACHER,
    });
    return googleClassroomApi.getGoogleSignInUrl(
      loginHint,
      subscribeToNewsletter,
    );
  };

  const onSuccessfulSignIn = () => {
    const redirectUrl = searchParams?.get("redirecturi");
    const decodedUrl = redirectUrl ? decodeURIComponent(redirectUrl) : null;
    const isSafeInternalPath =
      decodedUrl !== null &&
      decodedUrl.startsWith("/") &&
      !decodedUrl.startsWith("//");
    trackSignInCompleted({
      analyticsUseCase: AnalyticsUseCase.TEACHER,
      subscribeToNewsletter: subscribeToNewsletterRef.current,
    });
    const currentParams = searchParams?.toString() ?? "";
    const url = isSafeInternalPath
      ? decodedUrl
      : `/classroom/browse?${currentParams}`;
    router.push(url);
  };

  return (
    <OakBox $background={"bg-primary"} $width={"100%"} $minHeight={"100vh"}>
      <GoogleSignInView
        getGoogleSignInLink={getGoogleSignInLink}
        onSuccessfulSignIn={onSuccessfulSignIn}
        privacyPolicyUrl={"/legal/privacy-policy"}
      />
    </OakBox>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInContent />
    </Suspense>
  );
}
