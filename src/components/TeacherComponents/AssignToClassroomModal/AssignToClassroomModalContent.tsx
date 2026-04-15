"use client";

import { FC } from "react";
import styled from "styled-components";
import {
  OakBox,
  OakButtonAsRadioGroup,
  OakFlex,
  OakHeading,
  OakLoadingSpinner,
  OakP,
  OakPrimaryButton,
  OakSecondaryButtonAsRadio,
  OakSmallSecondaryButton,
  OakTextInput,
} from "@oaknational/oak-components";
import { CourseListItem } from "@oaknational/google-classroom-addon/types";

export const ASSIGN_MODAL_HEADING_ID = "assign-modal-heading";
export const ASSIGN_MODAL_DESCRIPTION_ID = "assign-modal-description";

// OakSecondaryButtonAsRadio's internal button defaults to width:max-content
// with no prop to override it — target the button element directly.
const FullWidthRadioGroup = styled(OakButtonAsRadioGroup)`
  width: 100%;
  flex-direction: column;
  > * {
    width: 100%;
  }
`;

type AssignToClassroomModalMessageStateProps = {
  heading: string;
  description: string;
  primaryActionLabel: string;
  onPrimaryAction: () => void;
  primaryActionDisabled?: boolean;
  primaryActionLoading?: boolean;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
};

type AssignToClassroomModalCoursePickerStateProps = {
  title: string;
  courses: CourseListItem[];
  selectedCourseId: string;
  isSubmitting: boolean;
  onTitleChange: (value: string) => void;
  onSelectedCourseIdChange: (courseId: string) => void;
  onAssign: () => void;
  onCancel: () => void;
};

type AssignToClassroomModalSuccessStateProps = {
  title: string;
  onClose: () => void;
  viewDraftHref: string;
};

const AssignToClassroomModalLoadingState: FC = () => (
  <OakFlex
    $justifyContent="center"
    $alignItems="center"
    $minHeight="spacing-16"
  >
    <OakLoadingSpinner />
  </OakFlex>
);

const AssignToClassroomModalMessageState: FC<
  AssignToClassroomModalMessageStateProps
> = ({
  heading,
  description,
  primaryActionLabel,
  onPrimaryAction,
  primaryActionDisabled,
  primaryActionLoading,
  secondaryActionLabel,
  onSecondaryAction,
}) => (
  <OakFlex $flexDirection="column" $gap="spacing-24">
    <OakHeading tag="h2" $font="heading-5" id={ASSIGN_MODAL_HEADING_ID}>
      {heading}
    </OakHeading>
    <OakP id={ASSIGN_MODAL_DESCRIPTION_ID}>{description}</OakP>
    <OakFlex $gap="spacing-12" $flexWrap="wrap">
      <OakPrimaryButton
        onClick={onPrimaryAction}
        disabled={primaryActionDisabled}
        isLoading={primaryActionLoading}
      >
        {primaryActionLabel}
      </OakPrimaryButton>
      {secondaryActionLabel && onSecondaryAction ? (
        <OakSmallSecondaryButton onClick={onSecondaryAction}>
          {secondaryActionLabel}
        </OakSmallSecondaryButton>
      ) : null}
    </OakFlex>
  </OakFlex>
);

const AssignToClassroomModalCoursePickerState: FC<
  AssignToClassroomModalCoursePickerStateProps
> = ({
  title,
  courses,
  selectedCourseId,
  isSubmitting,
  onTitleChange,
  onSelectedCourseIdChange,
  onAssign,
  onCancel,
}) => (
  <OakFlex $flexDirection="column" $gap="spacing-24">
    <OakHeading tag="h2" $font="heading-5" id={ASSIGN_MODAL_HEADING_ID}>
      Save to Google Classroom
    </OakHeading>
    {courses.length === 0 ? (
      <OakP>No active classes found in your Google Classroom.</OakP>
    ) : (
      <>
        <OakFlex $flexDirection="column" $gap="spacing-8">
          <OakP $font="body-2-bold">Assignment title</OakP>
          <OakTextInput
            value={title}
            onChange={(event) => onTitleChange(event.target.value)}
            aria-label="Assignment title"
          />
        </OakFlex>
        <OakFlex $flexDirection="column" $gap="spacing-8">
          <OakP $font="body-2-bold" id="course-select-label">
            Select a class
          </OakP>
          <OakBox
            $overflowY="auto"
            $maxHeight="spacing-240"
            $ba="border-solid-s"
            $borderColor="border-neutral"
            $borderRadius="border-radius-s"
            $pa="spacing-4"
          >
            <FullWidthRadioGroup
              name="course-selection"
              value={selectedCourseId}
              onChange={onSelectedCourseIdChange}
              $flexDirection="column"
              $gap="spacing-4"
              ariaLabelledby="course-select-label"
              disabled={isSubmitting}
            >
              {courses.map((course) => (
                <OakSecondaryButtonAsRadio key={course.id} value={course.id}>
                  {course.section
                    ? `${course.name} — ${course.section}`
                    : course.name}
                </OakSecondaryButtonAsRadio>
              ))}
            </FullWidthRadioGroup>
          </OakBox>
        </OakFlex>
        <OakFlex $gap="spacing-12" $mb={["spacing-12", "spacing-16"]}>
          <OakPrimaryButton
            onClick={onAssign}
            disabled={!selectedCourseId || isSubmitting || !title}
            isLoading={isSubmitting}
          >
            Share assignment
          </OakPrimaryButton>
          <OakSmallSecondaryButton onClick={onCancel}>
            Cancel
          </OakSmallSecondaryButton>
        </OakFlex>
      </>
    )}
  </OakFlex>
);

const AssignToClassroomModalSuccessState: FC<
  AssignToClassroomModalSuccessStateProps
> = ({ title, onClose, viewDraftHref }) => (
  <OakFlex $flexDirection="column" $gap="spacing-24">
    <OakHeading tag="h2" $font="heading-5" id={ASSIGN_MODAL_HEADING_ID}>
      Assignment saved
    </OakHeading>
    <OakP id={ASSIGN_MODAL_DESCRIPTION_ID}>
      &ldquo;{title}&rdquo; has been saved to your Google Classroom as a draft
      assignment. Open it in Google Classroom to publish it for your students.
    </OakP>
    <OakFlex $gap="spacing-12" $mb={["spacing-12", "spacing-16"]}>
      <OakPrimaryButton
        element="a"
        href={viewDraftHref}
        target="_blank"
        rel="noreferrer"
      >
        View draft
      </OakPrimaryButton>
      <OakSmallSecondaryButton onClick={onClose}>Close</OakSmallSecondaryButton>
    </OakFlex>
  </OakFlex>
);

export {
  AssignToClassroomModalCoursePickerState,
  AssignToClassroomModalLoadingState,
  AssignToClassroomModalMessageState,
  AssignToClassroomModalSuccessState,
};
