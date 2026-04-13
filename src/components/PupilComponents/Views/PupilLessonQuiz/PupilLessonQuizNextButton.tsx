import { OakPrimaryButton } from "@oaknational/oak-components";

export type PupilLessonQuizNextButtonProps = {
  label: string;
  onClick: () => void;
};

export const PupilLessonQuizNextButton = ({
  label,
  onClick,
}: PupilLessonQuizNextButtonProps) => {
  return (
    <OakPrimaryButton
      width={["100%", "max-content"]}
      onClick={onClick}
      isTrailingIcon
      iconName="arrow-right"
    >
      {label}
    </OakPrimaryButton>
  );
};
