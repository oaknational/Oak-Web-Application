"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GoogleSignInView } from "@oaknational/google-classroom-addon/ui";

import { googleClassroomApi } from "@/browser-lib/google-classroom";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getGoogleSignInLink = () => {
    return googleClassroomApi.getGoogleSignInUrl(
      searchParams?.get("login_hint") ?? null,
    );
  };

  const onSuccessfulSignIn = () => {
    const currentParams = searchParams?.toString() ?? "";
    // if (!searchParams?.get("attachmentId")) {
    router.push(`/classroom/browse?${currentParams}`);
    // }
  };

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
