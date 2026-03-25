"use client";

import { Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GoogleSignInView } from "@oaknational/google-classroom-addon/ui";
import { OakBox } from "@oaknational/oak-components";

import { googleClassroomApi } from "@/browser-lib/google-classroom";
import useAnalytics from "@/context/Analytics/useAnalytics";
import { getClientEnvironment } from "@/components/GoogleClassroom/getClientEnvironment";
import { AnalyticsUseCase, Platform, Product } from "@/browser-lib/avo/Avo";

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
      platform: Platform.GOOGLE_CLASSROOM,
      product: Product.GOOGLE_CLASSROOM_ADDON,
      analyticsUseCase: AnalyticsUseCase.TEACHER,
      googleLoginHint: loginHint,
      clientEnvironment,
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
    track.classroomSignInCompleted({
      platform: Platform.GOOGLE_CLASSROOM,
      product: Product.GOOGLE_CLASSROOM_ADDON,
      analyticsUseCase: AnalyticsUseCase.TEACHER,
      googleLoginHint: loginHint,
      subscribeToNewsletter: subscribeToNewsletterRef.current,
      clientEnvironment,
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
