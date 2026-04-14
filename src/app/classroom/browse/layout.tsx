"use client";

import {
  BrowseLayout,
  WithGoogleClassroomAuth,
} from "@oaknational/google-classroom-addon/ui";

import { googleClassroomApi } from "@/browser-lib/google-classroom";
import { useGoogleClassroomAnalytics } from "@/components/GoogleClassroom/useGoogleClassroomAnalytics";

type Props = {
  children: React.ReactNode;
};
export default function BrowseGoogleClassroomLayout({
  children,
}: Readonly<Props>) {
  const trackLessonAttached = useGoogleClassroomAnalytics(
    (state) => state.trackLessonAttached,
  );
  return (
    <WithGoogleClassroomAuth
      verifySessionAction={googleClassroomApi.verifySession()}
      signInUrl={"/classroom/sign-in"}
    >
      <BrowseLayout
        createAttachmentAction={googleClassroomApi.createAttachment}
        onLessonAttached={trackLessonAttached}
      >
        {children}
      </BrowseLayout>
    </WithGoogleClassroomAuth>
  );
}
