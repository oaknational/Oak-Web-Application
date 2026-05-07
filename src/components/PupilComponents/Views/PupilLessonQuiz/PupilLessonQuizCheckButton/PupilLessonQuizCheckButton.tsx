import { OakPrimaryButton, OakTooltip } from "@oaknational/oak-components";

export type PupilLessonQuizCheckButtonProps = {
  formId: string;
  disabled?: boolean;
  tooltip?: string;
  isTooltipOpen?: boolean;
  tooltipId?: string;
};

export const PupilLessonQuizCheckButton = ({
  formId,
  disabled,
  tooltip,
  isTooltipOpen = false,
  tooltipId = "quiz-tooltip",
}: PupilLessonQuizCheckButtonProps) => {
  return (
    <OakTooltip
      tooltip={tooltip ?? ""}
      isOpen={isTooltipOpen}
      tooltipPosition="top-right"
      id={tooltipId}
    >
      <OakPrimaryButton
        form={formId}
        type="submit"
        isTrailingIcon
        iconName="arrow-right"
        width={["100%", "max-content"]}
        disabled={disabled}
        aria-describedby={isTooltipOpen ? tooltipId : undefined}
      >
        Check
      </OakPrimaryButton>
    </OakTooltip>
  );
};
