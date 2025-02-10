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

  const message = isResourcesMessage
    ? "Switch to our new teaching resources now - designed by teachers and leading subject experts, and tested in classrooms."
    : `We've made brand-new and improved lessons for you.`;

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
            {`View new ${isResourcesMessage ? "resources" : "lessons"}`}
          </OakSecondaryButton>
        </OakBox>
      }
      isOpen={isOpen}
      message={message}
      onDismiss={onClose}
      title={title}
      type="alert"
    />
  );
};
