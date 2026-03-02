"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AuthCookieKeys,
  GoogleSignInView,
} from "@oaknational/google-classroom-addon/ui";

import { googleClassroomApi } from "@/browser-lib/google-classroom";

// Double check how posthog and avo are set up
// posthog sdk can it be called directly?!
// Is there a check that we're utilising google classroom
// can the pupils events be linked back to the original thread?- knowing how a cluster events is in tesponse to a teachers assignment - can firestore be used for this

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getGoogleSignInLink = () => {
    return googleClassroomApi.getGoogleSignInUrl(
      searchParams?.get("login_hint") ?? null,
      true,
    );
  };

  const onSuccessfulSignIn = () => {
    const programmeSlug = searchParams?.get("programmeSlug");
    const unitSlug = searchParams?.get("unitSlug");
    const lessonSlug = searchParams?.get("lessonSlug");
    const currentParams = searchParams?.toString() ?? "";
    if (programmeSlug && unitSlug && lessonSlug) {
      router.push(
        `/pupils/programmes/${programmeSlug}/units/${unitSlug}/lessons/${lessonSlug}?${currentParams}`,
      );
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
