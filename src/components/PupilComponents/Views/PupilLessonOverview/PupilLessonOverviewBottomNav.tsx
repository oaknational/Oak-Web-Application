import {
  OakLessonBottomNav,
  OakPrimaryButton,
} from "@oaknational/oak-components";

export type PupilLessonOverviewBottomNavProps = {
  proceedLabel: string;
  onProceed: () => void;
  disabled?: boolean;
  testId?: string;
};

export const PupilLessonOverviewBottomNav = ({
  proceedLabel,
  onProceed,
  disabled,
  testId = "proceed-to-next-section",
}: PupilLessonOverviewBottomNavProps) => {
  return (
    <OakLessonBottomNav>
      <OakPrimaryButton
        onClick={onProceed}
        width={["100%", "max-content"]}
        iconName="arrow-right"
        isTrailingIcon
        data-testid={testId}
        disabled={disabled}
      >
        {proceedLabel}
      </OakPrimaryButton>
    </OakLessonBottomNav>
  );
};
