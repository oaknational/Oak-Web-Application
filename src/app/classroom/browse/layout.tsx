"use client";

import {
  BrowseLayout,
  WithGoogleClassroomAuth,
} from "@oaknational/google-classroom-addon/ui";

import { googleClassroomApi } from "@/browser-lib/google-classroom";
import { getClassroomAssignmentId } from "@/browser-lib/google-classroom/classroomAnalytics";
import useAnalytics from "@/context/Analytics/useAnalytics";
type Props = {
  children: React.ReactNode;
};
export default function BrowseGoogleClassroomLayout({
  children,
}: Readonly<Props>) {
  const { track } = useAnalytics();

  return (
    <WithGoogleClassroomAuth
      verifySessionAction={googleClassroomApi.verifySession()}
      signInUrl={"/classroom/sign-in"}
    >
      <BrowseLayout
        createAttachmentAction={googleClassroomApi.createAttachment}
        onLessonAttached={(data) => {
          track.classroomLessonsAttached({
            googleLoginHint: data.googleLoginHint ?? "",
            itemId: data.itemId,
            courseId: data.courseId,
            lessonName: data.lessonName,
            unitName: data.unitName,
            gradeSyncEnabled: data.gradeSyncEnabled,
            clientEnvironment: "iframe",
            classroomAssignmentId: getClassroomAssignmentId({
              courseId: data.courseId,
              itemId: data.itemId,
            }),
          });
        }}
      >
        {children}
      </BrowseLayout>
    </WithGoogleClassroomAuth>
  );
}
