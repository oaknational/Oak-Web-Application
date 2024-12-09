import {
  OakBox,
  OakInlineBanner,
  OakSecondaryButton,
} from "@oaknational/oak-components";

export type ExpiringBannerProps = {
  isOpen: boolean;
  isResourcesMessage?: boolean;
  isSingular?: boolean;
  onwardHref: string;
  onClose: () => void;
  onViewNewLessons?: () => void;
};

export const ExpiringBanner = ({
  isOpen,
  isResourcesMessage,
  isSingular,
  onwardHref,
  onClose,
  onViewNewLessons,
}: ExpiringBannerProps) => {
  const title = (() => {
    switch (true) {
      case isResourcesMessage:
        return `These resources will be removed by end of Summer Term 2025.`;
      case isSingular:
        return `This lesson will be removed by end of Summer Term 2025.`;
      default:
        return `These lessons will be removed by end of Summer Term 2025.`;
    }
  })();

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
      title={title}
      type="alert"
    />
  );
};
