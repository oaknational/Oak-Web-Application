"use client";

import { FC, useCallback, useEffect, useRef, useState } from "react";
import {
  OakModalCenter,
  OakFlex,
  OakHeading,
  OakP,
  OakPrimaryButton,
  OakSmallSecondaryButton,
  OakLoadingSpinner,
  OakRadioButton,
  OakRadioGroup,
  OakTextInput,
} from "@oaknational/oak-components";
import { CourseListItem } from "@oaknational/google-classroom-addon/types";

import googleClassroomApi from "@/browser-lib/google-classroom/googleClassroomApi";
import { ScopeInsufficientError } from "@/browser-lib/google-classroom/errors";

const TEACHER_SESSION_COOKIE = "oak-gclassroom-session";
const TEACHER_TOKEN_COOKIE = "oak-gclassroom-token";

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
    const handleAuthMessage = (event: MessageEvent) => {
      if (event.data?.type !== "oak-google-classroom-auth-complete") return;
      popupRef.current?.close();
      popupRef.current = null;
      setIsSigningIn(false);
      if (event.data.success && event.data.session && event.data.accessToken) {
        globalThis.window.cookieStore?.set({
          name: TEACHER_SESSION_COOKIE,
          value: event.data.session as string,
          partitioned: true,
          sameSite: "none",
          path: "/",
        });
        globalThis.window.cookieStore?.set({
          name: TEACHER_TOKEN_COOKIE,
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
        maxPoints: exitQuizNumQuestions || 10,
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
        return (
          <OakFlex
            $justifyContent="center"
            $alignItems="center"
            $minHeight="spacing-16"
          >
            <OakLoadingSpinner />
          </OakFlex>
        );

      case "unauthenticated":
        return (
          <OakFlex $flexDirection="column" $gap="spacing-24">
            <OakHeading tag="h2" $font="heading-5" id="assign-modal-heading">
              Save to Google Classroom
            </OakHeading>
            <OakP id="assign-modal-description">
              Sign in with Google to save this assignment as a draft in your
              Google Classroom.
            </OakP>
            <OakPrimaryButton
              onClick={handleSignIn}
              disabled={isSigningIn}
              isLoading={isSigningIn}
            >
              Sign in with Google
            </OakPrimaryButton>
          </OakFlex>
        );

      case "scope_insufficient":
        return (
          <OakFlex $flexDirection="column" $gap="spacing-24">
            <OakHeading tag="h2" $font="heading-5" id="assign-modal-heading">
              Reconnect Google account
            </OakHeading>
            <OakP id="assign-modal-description">
              To create assignments from Oak, you need to grant an additional
              permission. Please reconnect your Google account to continue.
            </OakP>
            <OakPrimaryButton onClick={handleSignIn}>
              Reconnect Google account
            </OakPrimaryButton>
          </OakFlex>
        );

      case "course_picker":
        return (
          <OakFlex $flexDirection="column" $gap="spacing-24">
            <OakHeading tag="h2" $font="heading-5" id="assign-modal-heading">
              Save to Google Classroom
            </OakHeading>
            {state.courses.length === 0 ? (
              <OakP>No active classes found in your Google Classroom.</OakP>
            ) : (
              <>
                <OakFlex $flexDirection="column" $gap="spacing-8">
                  <OakP $font="body-2-bold">Assignment title</OakP>
                  <OakTextInput
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    aria-label="Assignment title"
                  />
                </OakFlex>
                <OakFlex $flexDirection="column" $gap="spacing-8">
                  <OakP $font="body-2-bold">Select a class</OakP>
                  <OakRadioGroup
                    name="course"
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                  >
                    {state.courses.map((course) => (
                      <OakRadioButton
                        key={course.id}
                        value={course.id}
                        label={
                          course.section
                            ? `${course.name} — ${course.section}`
                            : course.name
                        }
                        id={`course-${course.id}`}
                      />
                    ))}
                  </OakRadioGroup>
                </OakFlex>
                <OakFlex $gap="spacing-12">
                  <OakPrimaryButton
                    onClick={handleAssign}
                    disabled={!selectedCourseId || isSubmitting || !title}
                    isLoading={isSubmitting}
                  >
                    Share assignment
                  </OakPrimaryButton>
                  <OakSmallSecondaryButton onClick={onClose}>
                    Cancel
                  </OakSmallSecondaryButton>
                </OakFlex>
              </>
            )}
          </OakFlex>
        );

      case "success":
        return (
          <OakFlex $flexDirection="column" $gap="spacing-24">
            <OakHeading tag="h2" $font="heading-5" id="assign-modal-heading">
              Assignment saved
            </OakHeading>
            <OakP id="assign-modal-description">
              &ldquo;{state.title}&rdquo; has been saved to your Google
              Classroom as a draft assignment. Open it in Google Classroom to
              publish it for your students.
            </OakP>
            <OakFlex $gap="spacing-12">
              <OakPrimaryButton
                element="a"
                href="https://classroom.google.com"
                target="_blank"
                rel="noreferrer"
              >
                View draft
              </OakPrimaryButton>
              <OakSmallSecondaryButton onClick={onClose}>
                Close
              </OakSmallSecondaryButton>
            </OakFlex>
          </OakFlex>
        );

      case "error":
        return (
          <OakFlex $flexDirection="column" $gap="spacing-24">
            <OakHeading tag="h2" $font="heading-5" id="assign-modal-heading">
              Something went wrong
            </OakHeading>
            <OakP id="assign-modal-description">{state.message}</OakP>
            <OakFlex $gap="spacing-12">
              <OakPrimaryButton onClick={checkSessionAndLoadCourses}>
                Try again
              </OakPrimaryButton>
              <OakSmallSecondaryButton onClick={onClose}>
                Cancel
              </OakSmallSecondaryButton>
            </OakFlex>
          </OakFlex>
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
        "aria-labelledby": "assign-modal-heading",
        "aria-describedby": "assign-modal-description",
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
