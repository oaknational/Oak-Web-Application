import {
  OakBox,
  OakInlineBanner,
  OakSecondaryButton,
} from "@oaknational/oak-components";

export type ExpiringBannerProps = {
  isOpen: boolean;
  isResourcesMessage: boolean;
  onwardHref: string;
  onClose: () => void;
  onViewNewLessons?: () => void;
};

export const ExpiringBanner = ({
  isOpen,
  isResourcesMessage,
  onwardHref,
  onClose,
  onViewNewLessons,
}: ExpiringBannerProps) => {
  return (
    <OakInlineBanner
      canDismiss
      cta={
        <OakBox $pt="inner-padding-s">
          <OakSecondaryButton
            element="a"
            iconName="arrow-right"
            isTrailingIcon
            href={onwardHref}
            onClick={onViewNewLessons}
          >
            View new lessons
          </OakSecondaryButton>
        </OakBox>
      }
      isOpen={isOpen}
      message="We've made brand-new and improved lessons for you."
      onDismiss={onClose}
      title={`These ${isResourcesMessage ? "resources" : "lessons"} will be removed by end of Summer Term 2025.`}
      type="alert"
    />
  );
};
