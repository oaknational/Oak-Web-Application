"use client";

import {
  GoogleClassroomBrowseView,
  WithGoogleClassroomAuth,
} from "@oaknational/google-classroom-addon/ui";

import { googleClassroomApi } from "@/browser-lib/google-classroom";

function BrowseGoogleClassroomPage() {
  return (
    <WithGoogleClassroomAuth
      verifySessionFn={googleClassroomApi.verifySession}
      signInUrl={"/classroom/sign-in"}
    >
      <GoogleClassroomBrowseView />
    </WithGoogleClassroomAuth>
  );
}

export default BrowseGoogleClassroomPage;
