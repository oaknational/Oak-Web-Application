"use client";

import { FC, useState } from "react";

import AssignToClassroomModal from "./AssignToClassroomModal";

import LoadingButton from "@/components/SharedComponents/Button/LoadingButton";

type AssignToClassroomButtonProps = {
  lessonSlug: string;
  programmeSlug: string;
  unitSlug: string;
  lessonTitle: string;
  exitQuizNumQuestions?: number;
  disabled?: boolean;
  onAssigned?: () => void;
};

const AssignToClassroomButton: FC<AssignToClassroomButtonProps> = ({
  lessonSlug,
  programmeSlug,
  unitSlug,
  lessonTitle,
  exitQuizNumQuestions,
  disabled = false,
  onAssigned,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <LoadingButton
        text="Google Classroom"
        icon="google-classroom"
        type="button"
        isLoading={false}
        disabled={disabled}
        ariaLabel="Assign to Google Classroom"
        ariaLive="polite"
        onClick={() => {
          setIsModalOpen(true);
          onAssigned?.();
        }}
      />
      <AssignToClassroomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        lessonSlug={lessonSlug}
        programmeSlug={programmeSlug}
        unitSlug={unitSlug}
        lessonTitle={lessonTitle}
        exitQuizNumQuestions={exitQuizNumQuestions}
      />
    </>
  );
};

export default AssignToClassroomButton;
