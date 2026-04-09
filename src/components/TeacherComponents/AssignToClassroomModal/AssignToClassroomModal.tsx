"use client";

import { FC, useCallback, useEffect, useState } from "react";
import {
  OakBox,
  OakFlex,
  OakHeading,
  OakP,
  OakPrimaryButton,
  OakSecondaryButton,
  OakModalCenter,
  OakModalCenterBody,
  OakSpan,
  OakIcon,
} from "@oaknational/oak-components";
import {
  AuthCookieKeys,
  GoogleSignInView,
} from "@oaknational/google-classroom-addon/ui";
import { CourseListItem } from "@oaknational/google-classroom-addon/types";

import googleClassroomApi from "@/browser-lib/google-classroom/googleClassroomApi";

type Step = "sign-in" | "select-course" | "success";

export type AssignToClassroomModalProps = {
  isOpen: boolean;
  onClose: () => void;
  lessonTitle: string;
  lessonSlug: string;
  programmeSlug: string;
  unitSlug: string;
  exitQuizNumQuestions?: number;
};

/**
 * Multi-step modal for assigning an Oak lesson to Google Classroom via the
 * CourseWork API.
 *
 * Step 1 – Sign in:      Teacher authenticates with Google (teacher scopes).
 * Step 2 – Select course: Choose a course, optionally edit the assignment title.
 * Step 3 – Success:       Confirmation + link to Google Classroom.
 */
export const AssignToClassroomModal: FC<AssignToClassroomModalProps> = ({
  isOpen,
  onClose,
  lessonTitle,
  lessonSlug,
  programmeSlug,
  unitSlug,
  exitQuizNumQuestions,
}) => {
  const [step, setStep] = useState<Step>("sign-in");
  const [courses, setCourses] = useState<CourseListItem[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [assignmentTitle, setAssignmentTitle] = useState(lessonTitle);
  const [maxPoints, setMaxPoints] = useState(exitQuizNumQuestions ?? 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [classroomUrl, setClassroomUrl] = useState<string | null>(null);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);

  const loadCourses = useCallback(async () => {
    setIsLoadingCourses(true);
    setError(null);
    try {
      const list = await googleClassroomApi.listCourses();
      setCourses(list);
      if (list.length > 0 && list[0]) {
        setSelectedCourseId(list[0].id);
      }
    } catch {
      setError(
        "Could not load your Google Classroom courses. Please try again.",
      );
    } finally {
      setIsLoadingCourses(false);
    }
  }, []);

  // When the modal opens, check if already authenticated
  useEffect(() => {
    if (!isOpen) return;

    const checkAuth = async () => {
      const session = await googleClassroomApi.verifySession(false)();
      if (session.authenticated) {
        setStep("select-course");
        await loadCourses();
      } else {
        setStep("sign-in");
      }
    };

    void checkAuth();
  }, [isOpen, loadCourses]);

  // Reset state when the modal is closed
  const handleClose = () => {
    setError(null);
    setIsSubmitting(false);
    setClassroomUrl(null);
    setStep("sign-in");
    onClose();
  };

  const handleSignedIn = async () => {
    setStep("select-course");
    await loadCourses();
  };

  const handleAssign = async () => {
    if (!selectedCourseId) return;
    setIsSubmitting(true);
    setError(null);

    try {
      const result = await googleClassroomApi.createCourseWork({
        courseId: selectedCourseId,
        title: assignmentTitle,
        lessonSlug,
        programmeSlug,
        unitSlug,
        maxPoints,
      });

      // Google Classroom doesn't give a direct deep-link to a draft assignment,
      // so we link to the teacher's course stream instead.
      setClassroomUrl(`https://classroom.google.com/c/${result.courseId}`);
      setStep("success");
    } catch {
      setError(
        "Failed to create the assignment. Please check your connection and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);

  return (
    <OakModalCenter isOpen={isOpen} onClose={handleClose}>
      <OakModalCenterBody
        title="Assign to Google Classroom"
        iconName="google-classroom"
      >
        {step === "sign-in" && (
          <OakBox $pa="spacing-4">
            <GoogleSignInView
              getGoogleSignInLink={() =>
                googleClassroomApi.getGoogleSignInUrl(null, false, false)
              }
              onSuccessfulSignIn={handleSignedIn}
              privacyPolicyUrl="/legal/privacy-policy"
              showMailingListOption={false}
              cookieKeys={[AuthCookieKeys.AccessToken, AuthCookieKeys.Session]}
            />
          </OakBox>
        )}

        {step === "select-course" && (
          <OakFlex $flexDirection="column" $gap="spacing-4" $pa="spacing-4">
            {isLoadingCourses ? (
              <OakP>Loading your classes…</OakP>
            ) : (
              <>
                <OakFlex $flexDirection="column" $gap="spacing-4">
                  <label htmlFor="gc-course-select">
                    <OakSpan $font="body-2-bold">
                      Google Classroom class
                    </OakSpan>
                  </label>
                  <select
                    id="gc-course-select"
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      fontSize: "16px",
                      width: "100%",
                    }}
                  >
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.name}
                        {course.section ? ` – ${course.section}` : ""}
                      </option>
                    ))}
                  </select>
                </OakFlex>

                <OakFlex $flexDirection="column" $gap="spacing-4">
                  <label htmlFor="gc-assignment-title">
                    <OakSpan $font="body-2-bold">Assignment title</OakSpan>
                  </label>
                  <input
                    id="gc-assignment-title"
                    type="text"
                    value={assignmentTitle}
                    onChange={(e) => setAssignmentTitle(e.target.value)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      fontSize: "16px",
                      width: "100%",
                    }}
                  />
                </OakFlex>

                <OakFlex $flexDirection="column" $gap="spacing-4">
                  <label htmlFor="gc-max-points">
                    <OakSpan $font="body-2-bold">Points</OakSpan>
                  </label>
                  <input
                    id="gc-max-points"
                    type="number"
                    min={0}
                    value={maxPoints}
                    onChange={(e) =>
                      setMaxPoints(
                        Math.max(0, parseInt(e.target.value, 10) || 0),
                      )
                    }
                    style={{
                      padding: "8px 12px",
                      borderRadius: "4px",
                      border: "1px solid #ccc",
                      fontSize: "16px",
                      width: "120px",
                    }}
                  />
                </OakFlex>

                {error && (
                  <OakFlex $alignItems="center" $gap="spacing-4">
                    <OakIcon iconName="error" $colorFilter="icon-error" />
                    <OakSpan $color="icon-error" $font="body-3">
                      {error}
                    </OakSpan>
                  </OakFlex>
                )}

                <OakP $font="body-3" $color="text-subdued">
                  The assignment will be saved as a <strong>draft</strong> in
                  Google Classroom. Pupils will not see it until you publish it.
                </OakP>

                <OakFlex
                  $gap="spacing-4"
                  $justifyContent="flex-end"
                  $mt="spacing-4"
                >
                  <OakSecondaryButton onClick={handleClose}>
                    Cancel
                  </OakSecondaryButton>
                  <OakPrimaryButton
                    onClick={handleAssign}
                    disabled={
                      isSubmitting ||
                      !selectedCourseId ||
                      !assignmentTitle.trim()
                    }
                  >
                    {isSubmitting ? "Assigning…" : "Assign"}
                  </OakPrimaryButton>
                </OakFlex>
              </>
            )}
          </OakFlex>
        )}

        {step === "success" && (
          <OakFlex
            $flexDirection="column"
            $gap="spacing-4"
            $pa="spacing-4"
            $alignItems="center"
          >
            <OakIcon iconName="tick" $colorFilter="icon-success" />
            <OakHeading tag="h3" $font="heading-5">
              Assignment created!
            </OakHeading>
            <OakP $textAlign="center">
              <strong>{assignmentTitle}</strong> has been added as a draft to{" "}
              <strong>{selectedCourse?.name ?? "your class"}</strong>. Open
              Google Classroom to review and publish it.
            </OakP>

            {classroomUrl && (
              <OakPrimaryButton
                onClick={() =>
                  window.open(classroomUrl, "_blank", "noopener,noreferrer")
                }
                iconName="external"
                isTrailingIcon
              >
                Open Google Classroom
              </OakPrimaryButton>
            )}

            <OakSecondaryButton onClick={handleClose}>Close</OakSecondaryButton>
          </OakFlex>
        )}
      </OakModalCenterBody>
    </OakModalCenter>
  );
};

export default AssignToClassroomModal;
