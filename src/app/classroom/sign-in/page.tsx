"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GoogleSignInView } from "@oaknational/google-classroom-addon/ui";

import { googleClassroomApi } from "@/browser-lib/google-classroom";
import useAnalytics from "@/context/Analytics/useAnalytics";
import { getClientEnvironment } from "@/components/GoogleClassroom/getClientEnvironment";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { track } = useAnalytics();

  const clientEnvironment = getClientEnvironment();
  const loginHint = searchParams?.get("login_hint") ?? null;

  const subscribeToNewsletterRef = useRef<boolean>(false);

  const getGoogleSignInLink = (subscribeToNewsletter?: boolean) => {
    subscribeToNewsletterRef.current = subscribeToNewsletter ?? false;
    track.classroomSignInStarted({
      platform: "google-classroom",
      product: "google classroom addon",
      analyticsUseCase: "Teacher",
      googleLoginHint: loginHint,
    });
    return googleClassroomApi.getGoogleSignInUrl(
      loginHint,
      subscribeToNewsletter,
    );
  };

  const onSuccessfulSignIn = () => {
    track.classroomSignInCompleted({
      platform: "google-classroom",
      product: "google classroom addon",
      analyticsUseCase: "Teacher",
      googleLoginHint: loginHint,
      subscribeToNewsletter: subscribeToNewsletterRef.current,
      clientEnvironment,
    });
    const currentParams = searchParams?.toString() ?? "";
    router.push(`/classroom/browse?${currentParams}`);
  };

  useEffect(() => {
    track.classroomAddOnOpened({
      platform: "google-classroom",
      product: "google classroom addon",
      engagementIntent: "use",
      componentType: "page view",
      eventVersion: "2.0.0",
      analyticsUseCase: "Teacher",
      clientEnvironment,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <GoogleSignInView
      getGoogleSignInLink={getGoogleSignInLink}
      onSuccessfulSignIn={onSuccessfulSignIn}
      privacyPolicyUrl={"/legal/privacy-policy"}
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
