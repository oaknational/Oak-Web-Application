import React, { ReactNode } from "react";
import { renderHook, act } from "@testing-library/react";
import { OakPupilClientProvider } from "@oaknational/oak-pupil-client";

import { useTeacherNotes } from "./useTeacherNotes";

// TODO mock the pupil client

describe("useTeacherNotes", () => {
  const createWrapper = () => {
    const config = {
      logLessonAttemptUrl: "example.com",
      getLessonAttemptUrl: "example.com",
      getTeacherNoteUrl: "example.com",
      addTeacherNoteUrl: "example.com",
    };
    return ({ children }: { children: ReactNode }) => (
      <OakPupilClientProvider config={config}>
        {" "}
        {children}{" "}
      </OakPupilClientProvider>
    );
  };

  it("should not attempt to fetch a teacher note if not enabled", () => {
    const wrapper = createWrapper();
    // render hook
    renderHook(
      () =>
        useTeacherNotes({
          sidKey: "sidKey",
          lessonPath: "lessonPath",
          shareId: "shareId",
          enabled: false,
        }),
      { wrapper },
    );
  });
});
