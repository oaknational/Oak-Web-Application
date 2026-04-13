"use client";

import { FC } from "react";
import {
  OakFlex,
  OakHeading,
  OakLoadingSpinner,
  OakP,
  OakPrimaryButton,
  OakRadioButton,
  OakRadioGroup,
  OakSmallSecondaryButton,
  OakTextInput,
} from "@oaknational/oak-components";
import { CourseListItem } from "@oaknational/google-classroom-addon/types";

export const ASSIGN_MODAL_HEADING_ID = "assign-modal-heading";
export const ASSIGN_MODAL_DESCRIPTION_ID = "assign-modal-description";

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
          <OakP $font="body-2-bold">Select a class</OakP>
          <OakRadioGroup
            name="course"
            value={selectedCourseId}
            onChange={(event) => onSelectedCourseIdChange(event.target.value)}
          >
            {courses.map((course) => (
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
    <OakFlex $gap="spacing-12">
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
