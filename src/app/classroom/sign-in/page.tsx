"use client";

import { GoogleSignInView } from "@oaknational/google-classroom-addon/ui";
import { useRouter, useSearchParams } from "next/navigation";

import { googleClassroomApi } from "@/browser-lib/google-classroom";

function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getGoogleSignInLink = () => {
    return googleClassroomApi.getGoogleSignInUrl(
      searchParams?.get("login_hint") ?? null,
    );
  };

  const onSuccessfulSignIn = () => {
    const currentParams = searchParams?.toString() ?? "";
    router.push(`/classroom/browse?${currentParams}`);
  };

  return (
    <GoogleSignInView
      getGoogleSignInLink={getGoogleSignInLink}
      onSuccessfulSignIn={onSuccessfulSignIn}
      privacyPolicyUrl={"/legal/privacy-policy"}
    />
  );
}

export default SignInPage;
