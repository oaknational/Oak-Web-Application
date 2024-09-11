"use client";

import {
  OakPupilClient,
  OakPupilClientProvider,
} from "@oaknational/oak-pupil-client";

const client = new OakPupilClient({
  //TODO: Replace with actual URLs config
  getLessonAttemptUrl: "https://example.com/get-lessom-attempt",
  logLessonAttemptUrl: "http://example.com/log-lesson-attempt",
  onError: console.error,
});

export const PupilProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <OakPupilClientProvider client={client}>{children}</OakPupilClientProvider>
  );
};
