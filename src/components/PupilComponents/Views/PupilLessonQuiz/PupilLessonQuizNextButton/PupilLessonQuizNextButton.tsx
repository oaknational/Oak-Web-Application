import { OakPrimaryButton } from "@oaknational/oak-components";

export type PupilLessonQuizNextButtonProps = {
  label: string;
  onClick: () => void;
  isLoading?: boolean;
};

export const PupilLessonQuizNextButton = ({
  label,
  onClick,
  isLoading,
}: PupilLessonQuizNextButtonProps) => {
  return (
    <OakPrimaryButton
      width={["100%", "max-content"]}
      onClick={onClick}
      isTrailingIcon
      iconName="arrow-right"
      isLoading={isLoading}
    >
      {label}
    </OakPrimaryButton>
  );
};
