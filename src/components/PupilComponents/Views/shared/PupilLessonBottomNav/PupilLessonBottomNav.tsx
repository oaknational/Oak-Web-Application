import {
  OakLessonBottomNav,
  OakPrimaryButton,
} from "@oaknational/oak-components";

export type PupilLessonBottomNavProps = {
  proceedLabel: string;
  onProceed: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  testId?: string;
};

export const PupilLessonBottomNav = ({
  proceedLabel,
  onProceed,
  disabled,
  isLoading,
  testId = "proceed-to-next-section",
}: PupilLessonBottomNavProps) => {
  return (
    <OakLessonBottomNav>
      <OakPrimaryButton
        onClick={onProceed}
        width={["100%", "max-content"]}
        iconName="arrow-right"
        isTrailingIcon
        data-testid={testId}
        disabled={disabled}
        isLoading={isLoading}
      >
        {proceedLabel}
      </OakPrimaryButton>
    </OakLessonBottomNav>
  );
};
