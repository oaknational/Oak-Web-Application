"use client";

import { FC, useCallback, useEffect, useRef, useState } from "react";
import { OakModalCenter } from "@oaknational/oak-components";
import { CourseListItem } from "@oaknational/google-classroom-addon/types";
import { AuthCookieKeys } from "@oaknational/google-classroom-addon/ui";

import {
  ASSIGN_MODAL_DESCRIPTION_ID,
  ASSIGN_MODAL_HEADING_ID,
  AssignToClassroomModalCoursePickerState,
  AssignToClassroomModalLoadingState,
  AssignToClassroomModalMessageState,
  AssignToClassroomModalSuccessState,
} from "./AssignToClassroomModalContent";

import googleClassroomApi from "@/browser-lib/google-classroom/googleClassroomApi";
import { ScopeInsufficientError } from "@/browser-lib/google-classroom/errors";

type ModalState =
  | { type: "loading" }
  | { type: "unauthenticated" }
  | { type: "scope_insufficient" }
  | { type: "course_picker"; courses: CourseListItem[] }
  | { type: "success"; title: string }
  | { type: "error"; message: string };

type AssignToClassroomModalProps = {
  isOpen: boolean;
  onClose: () => void;
  lessonSlug: string;
  programmeSlug: string;
  unitSlug: string;
  lessonTitle: string;
  exitQuizNumQuestions?: number;
};

const toModalErrorState = (
  error: unknown,
  fallbackMessage = "An error occurred",
): ModalState => {
  if (error instanceof ScopeInsufficientError) {
    return { type: "scope_insufficient" };
  }
  return {
    type: "error",
    message: error instanceof Error ? error.message : fallbackMessage,
  };
};

const AssignToClassroomModal: FC<AssignToClassroomModalProps> = ({
  isOpen,
  onClose,
  lessonSlug,
  programmeSlug,
  unitSlug,
  lessonTitle,
  exitQuizNumQuestions,
}) => {
  const [state, setState] = useState<ModalState>({ type: "loading" });
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [title, setTitle] = useState(lessonTitle);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const popupRef = useRef<Window | null>(null);

  const checkSessionAndLoadCourses = useCallback(async () => {
    setState({ type: "loading" });
    try {
      const session = await googleClassroomApi.verifySession()();
      if (!session.authenticated) {
        setState({ type: "unauthenticated" });
        return;
      }
      const courses = await googleClassroomApi.listCourses();
      setState({ type: "course_picker", courses });
      if (courses.length > 0) {
        setSelectedCourseId(courses[0]!.id);
      }
    } catch (error) {
      setState(toModalErrorState(error));
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTitle(lessonTitle);
      checkSessionAndLoadCourses();
    } else {
      setState({ type: "loading" });
      setIsSigningIn(false);
    }
  }, [isOpen, lessonTitle, checkSessionAndLoadCourses]);

  useEffect(() => {
    const handleAuthMessage = async (event: MessageEvent) => {
      if (event.data?.type !== "oak-google-classroom-auth-complete") return;
      if (event.origin !== globalThis.window.location.origin) return;
      if (event.source !== popupRef.current) return;
      popupRef.current?.close();
      popupRef.current = null;
      setIsSigningIn(false);
      if (event.data.success && event.data.session && event.data.accessToken) {
        // Note: sameSite "none" requires Secure; that attribute is not yet
        // modelled in the TypeScript CookieInit type but is enforced by the
        // browser at runtime — these cookies are only set over HTTPS.
        await globalThis.window.cookieStore?.set({
          name: AuthCookieKeys.Session,
          value: event.data.session as string,
          partitioned: true,
          sameSite: "none",
          path: "/",
        });
        await globalThis.window.cookieStore?.set({
          name: AuthCookieKeys.AccessToken,
          value: event.data.accessToken as string,
          partitioned: true,
          sameSite: "none",
          path: "/",
        });
        checkSessionAndLoadCourses();
      }
    };
    globalThis.window.addEventListener("message", handleAuthMessage);
    return () =>
      globalThis.window.removeEventListener("message", handleAuthMessage);
  }, [checkSessionAndLoadCourses]);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    const url = await googleClassroomApi.getGoogleSignInUrl(null);
    if (!url) {
      setIsSigningIn(false);
      return;
    }
    popupRef.current = globalThis.window.open(
      url,
      "googleSignIn",
      "height=500,width=500,left=100,top=100,resizable=no,scrollbars=yes",
    );
  };

  const handleAssign = async () => {
    if (!selectedCourseId || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const result = await googleClassroomApi.createCourseWork({
        courseId: selectedCourseId,
        title,
        lessonSlug,
        programmeSlug,
        unitSlug,
        maxPoints: exitQuizNumQuestions || 6, // defaulted to 6
      });
      setState({
        type: "success",
        title: result.title,
      });
    } catch (error) {
      setState(toModalErrorState(error, "Failed to assign lesson"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContent = () => {
    switch (state.type) {
      case "loading":
        return <AssignToClassroomModalLoadingState />;

      case "unauthenticated":
        return (
          <AssignToClassroomModalMessageState
            heading="Save to Google Classroom"
            description="Sign in with Google to save this assignment as a draft in your Google Classroom."
            primaryActionLabel="Sign in with Google"
            onPrimaryAction={handleSignIn}
            primaryActionDisabled={isSigningIn}
            primaryActionLoading={isSigningIn}
          />
        );

      case "scope_insufficient":
        return (
          <AssignToClassroomModalMessageState
            heading="Reconnect Google account"
            description="To create assignments from Oak, you need to grant an additional permission. Please reconnect your Google account to continue."
            primaryActionLabel="Reconnect Google account"
            onPrimaryAction={handleSignIn}
          />
        );

      case "course_picker":
        return (
          <AssignToClassroomModalCoursePickerState
            title={title}
            courses={state.courses}
            selectedCourseId={selectedCourseId}
            isSubmitting={isSubmitting}
            onTitleChange={setTitle}
            onSelectedCourseIdChange={setSelectedCourseId}
            onAssign={handleAssign}
            onCancel={onClose}
          />
        );

      case "success":
        return (
          <AssignToClassroomModalSuccessState
            title={state.title}
            onClose={onClose}
            viewDraftHref="https://classroom.google.com"
          />
        );

      case "error":
        return (
          <AssignToClassroomModalMessageState
            heading="Something went wrong"
            description={state.message}
            primaryActionLabel="Try again"
            onPrimaryAction={checkSessionAndLoadCourses}
            secondaryActionLabel="Cancel"
            onSecondaryAction={onClose}
          />
        );
    }
  };

  return (
    <OakModalCenter
      isOpen={isOpen}
      onClose={onClose}
      modalFlexProps={{
        $pa: ["spacing-32", "spacing-56"],
        $mh: "auto",
        "aria-modal": true,
        "aria-labelledby": ASSIGN_MODAL_HEADING_ID,
        "aria-describedby": ASSIGN_MODAL_DESCRIPTION_ID,
      }}
      modalOuterFlexProps={{
        $maxWidth: "spacing-640",
        $pa: "spacing-16",
      }}
    >
      {renderContent()}
    </OakModalCenter>
  );
};

export { AssignToClassroomModal };
export default AssignToClassroomModal;
