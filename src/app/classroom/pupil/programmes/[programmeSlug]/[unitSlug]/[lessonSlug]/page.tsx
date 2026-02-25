"use client";

import React from "react";
import {
  AuthCookieKeys,
  WithGoogleClassroomAuth,
} from "@oaknational/google-classroom-addon/ui";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import { googleClassroomApi } from "@/browser-lib/google-classroom";

type Params = {
  programmeSlug: string;
  unitSlug: string;
  lessonSlug: string;
};
function GoogleClassroomRedirectToPupilLessonPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams<Params>();
  const { programmeSlug, unitSlug, lessonSlug } = params ?? {};

  const redirectToPupilLessonPage = () => {
    const currentParams = searchParams?.toString() ?? "";
    router.push(
      `/pupils/programmes/${programmeSlug}/units/${unitSlug}/lessons/${lessonSlug}?${currentParams}`,
    );
  };
  return (
    <WithGoogleClassroomAuth
      verifySessionAction={googleClassroomApi.verifySession(true)}
      signInUrl={`/classroom/pupil/sign-in?programmeSlug=${programmeSlug}&unitSlug=${unitSlug}&lessonSlug=${lessonSlug}`}
      cookieKeys={[
        AuthCookieKeys.PupilAccessToken,
        AuthCookieKeys.PupilSession,
      ]}
      onVerifySuccess={redirectToPupilLessonPage}
    >
      <></>
    </WithGoogleClassroomAuth>
  );
}

export default GoogleClassroomRedirectToPupilLessonPage;
