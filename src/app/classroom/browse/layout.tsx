"use client";

import {
  BrowseLayout,
  WithGoogleClassroomAuth,
} from "@oaknational/google-classroom-addon/ui";

import { googleClassroomApi } from "@/browser-lib/google-classroom";
import useAnalytics from "@/context/Analytics/useAnalytics";
import { getClientEnvironment } from "@/components/GoogleClassroom/getClientEnvironment";

type Props = {
  children: React.ReactNode;
};
export default function BrowseGoogleClassroomLayout({
  children,
}: Readonly<Props>) {
  const { track } = useAnalytics();
  const clientEnvironment = getClientEnvironment();
  return (
    <WithGoogleClassroomAuth
      verifySessionAction={googleClassroomApi.verifySession()}
      signInUrl={"/classroom/sign-in"}
    >
      <BrowseLayout
        createAttachmentAction={googleClassroomApi.createAttachment}
        onLessonAttached={(data) => {
          track.classroomLessonsAttached({
            lessonName: data.lessonName,
            unitName: data.unitName,
            courseId: data.courseId,
            itemId: data.itemId,
            gradeSyncEnabled: data.gradeSyncEnabled,
            googleLoginHint: data.googleLoginHint ?? "",
            clientEnvironment,
          });
        }}
      >
        {children}
      </BrowseLayout>
    </WithGoogleClassroomAuth>
  );
}
