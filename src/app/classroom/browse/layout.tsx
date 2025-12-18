"use client";

import {
  BrowseLayout,
  WithGoogleClassroomAuth,
} from "@oaknational/google-classroom-addon/ui";

import { googleClassroomApi } from "@/browser-lib/google-classroom";
type Props = {
  children: React.ReactNode;
};
export default function BrowseGoogleClassroomLayout({ children }: Props) {
  return (
    <WithGoogleClassroomAuth
      verifySessionAction={googleClassroomApi.verifySession}
      signInUrl={"/classroom/sign-in"}
    >
      <BrowseLayout
        createAttachmentAction={googleClassroomApi.createAttachment}
      >
        {children}
      </BrowseLayout>
    </WithGoogleClassroomAuth>
  );
}
