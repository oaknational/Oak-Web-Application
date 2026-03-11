"use client";

import React from "react";
import {
  AuthCookieKeys,
  WithGoogleClassroomAuth,
} from "@oaknational/google-classroom-addon/ui";
import { useParams, useSearchParams } from "next/navigation";

import { googleClassroomApi } from "@/browser-lib/google-classroom";
type Params = {
  programmeSlug: string;
  unitSlug: string;
  lessonSlug: string;
};
function GoogleClassroomPupilResultsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const searchParams = useSearchParams();
  const params = useParams<Params>();
  const { programmeSlug, unitSlug, lessonSlug } = params ?? {};
  const [hasVerified, setHasVerified] = React.useState(false);

  const resultsUrl = () => {
    const currentParams = searchParams?.toString() ?? "";
    const baseUrl = `/classroom/pupil/programmes/${programmeSlug}/${unitSlug}/${lessonSlug}/results/printable`;
    return currentParams ? `${baseUrl}?${currentParams}` : baseUrl;
  };

  return (
    <WithGoogleClassroomAuth
      verifySessionAction={googleClassroomApi.verifySession()}
      signInUrl={`/classroom/sign-in?redirecturi=${encodeURIComponent(
        resultsUrl(),
      )}`}
      cookieKeys={[AuthCookieKeys.AccessToken, AuthCookieKeys.Session]}
      onVerifySuccess={() => setHasVerified(true)}
    >
      {hasVerified && children}
    </WithGoogleClassroomAuth>
  );
}

export default GoogleClassroomPupilResultsLayout;
