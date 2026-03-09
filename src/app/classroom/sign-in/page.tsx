"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GoogleSignInView } from "@oaknational/google-classroom-addon/ui";
import { OakBox } from "@oaknational/oak-components";

import { googleClassroomApi } from "@/browser-lib/google-classroom";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getGoogleSignInLink = (subscribeToNewsletter?: boolean) => {
    return googleClassroomApi.getGoogleSignInUrl(
      searchParams?.get("login_hint") ?? null,
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
