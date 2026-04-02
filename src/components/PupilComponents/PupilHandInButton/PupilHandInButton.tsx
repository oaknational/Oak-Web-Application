"use client";

import { useState } from "react";
import {
  OakFlex,
  OakIcon,
  OakLoadingSpinner,
  OakPrimaryButton,
  OakHeading,
} from "@oaknational/oak-components";
import {
  GoogleSignInView,
  AuthCookieKeys,
} from "@oaknational/google-classroom-addon/ui";

import { mapToCourseWorkPupilProgress } from "@/browser-lib/google-classroom/mapToCourseWorkPupilProgress";
import googleClassroomApi from "@/browser-lib/google-classroom/googleClassroomApi";
import type { CourseWorkProgressContext } from "@/browser-lib/google-classroom/classroomAssignmentContext";
import { useLessonEngineContext } from "@/components/PupilComponents/LessonEngineProvider";

type HandInState =
  | { type: "idle" }
  | { type: "needs_sign_in" }
  | { type: "loading" }
  | { type: "success" }
  | { type: "error"; message: string };

type PupilHandInButtonProps = {
  assignmentToken: string;
  googleLoginHint?: string | null;
};

export const PupilHandInButton = ({
  assignmentToken,
  googleLoginHint,
}: PupilHandInButtonProps) => {
  const { sectionResults } = useLessonEngineContext();
  const [state, setState] = useState<HandInState>({ type: "idle" });

  const handleHandIn = async () => {
    console.log("[HandIn] button clicked");
    setState({ type: "loading" });
    try {
      const session = await googleClassroomApi.verifySession(true)();
      console.log("[HandIn] verifySession:", {
        authenticated: session.authenticated,
        loginHint: session.loginHint,
      });
      if (!session.authenticated || !session.loginHint) {
        setState({ type: "needs_sign_in" });
        return;
      }

      const ctx =
        await googleClassroomApi.getCourseWorkContext(assignmentToken);
      console.log("[HandIn] getCourseWorkContext:", ctx);
      if (!ctx) {
        setState({
          type: "error",
          message: "Could not find assignment. Please try again.",
        });
        return;
      }

      const courseWorkContext: CourseWorkProgressContext = {
        submissionId: ctx.submissionId,
        assignmentToken: ctx.assignmentToken,
        courseWorkId: ctx.courseWorkId,
        courseId: ctx.courseId,
        pupilLoginHint: session.loginHint,
      };

      const payload = mapToCourseWorkPupilProgress(
        courseWorkContext,
        sectionResults,
      );
      console.log("[HandIn] upsertCourseWorkPupilProgress payload:", payload);
      await googleClassroomApi.upsertCourseWorkPupilProgress(payload);
      console.log("[HandIn] upsert succeeded");

      console.log("[HandIn] turning in submission:", ctx.submissionId);
      await googleClassroomApi.turnInCourseWorkSubmission({
        courseId: ctx.courseId,
        courseWorkId: ctx.courseWorkId,
        submissionId: ctx.submissionId,
        assignmentToken: ctx.assignmentToken,
      });
      console.log("[HandIn] turn in succeeded");

      setState({ type: "success" });
    } catch (e) {
      console.error("[HandIn] error:", e);
      setState({
        type: "error",
        message: "Failed to hand in. Please try again.",
      });
    }
  };

  if (state.type === "needs_sign_in") {
    return (
      <GoogleSignInView
        getGoogleSignInLink={() =>
          googleClassroomApi.getGoogleSignInUrl(
            googleLoginHint ?? null,
            false,
            true,
          )
        }
        onSuccessfulSignIn={() => void handleHandIn()}
        privacyPolicyUrl="/legal/privacy-policy"
        showMailingListOption={false}
        cookieKeys={[
          AuthCookieKeys.PupilAccessToken,
          AuthCookieKeys.PupilSession,
        ]}
      />
    );
  }

  if (state.type === "success") {
    return (
      <OakFlex $gap={"spacing-4"} $alignItems={"center"}>
        <OakIcon iconName={"tick"} $colorFilter={"text-success"} />
        <OakHeading tag="h2" $font={"heading-light-7"} $color={"text-success"}>
          Handed in to Google Classroom!
        </OakHeading>
      </OakFlex>
    );
  }

  if (state.type === "error") {
    return (
      <OakFlex $flexDirection="column" $gap={"spacing-8"}>
        <OakFlex $gap={"spacing-4"} $alignItems={"center"}>
          <OakIcon iconName={"cross"} $colorFilter={"text-error"} />
          <OakHeading tag="h2" $font={"heading-light-7"} $color={"text-error"}>
            {state.message}
          </OakHeading>
        </OakFlex>
        <OakPrimaryButton
          type="button"
          onClick={() => setState({ type: "idle" })}
          iconName={"arrow-right"}
          isTrailingIcon
        >
          Try again
        </OakPrimaryButton>
      </OakFlex>
    );
  }

  if (state.type === "loading") {
    return <OakLoadingSpinner />;
  }

  return (
    <OakPrimaryButton
      type="button"
      onClick={() => void handleHandIn()}
      iconName={"arrow-right"}
      isTrailingIcon
    >
      Hand in to Google Classroom
    </OakPrimaryButton>
  );
};
