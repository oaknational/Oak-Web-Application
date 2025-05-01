import {
  OakBox,
  OakInlineBanner,
  OakPrimaryButton,
  OakP,
} from "@oaknational/oak-components";

export type ExpiringBannerProps = {
  isOpen: boolean;
  isResourcesMessage?: boolean;
  isSingular?: boolean;
  onwardHref: string;
  onViewNewLessons?: () => void;
};

export const ExpiringBanner = ({
  isOpen,
  isResourcesMessage,
  isSingular,
  onwardHref,
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

  const message = isResourcesMessage ? (
    <>
      <OakP>
        Switch to our new teaching resources now - designed by teachers and
        leading subject experts, and tested in classrooms.
      </OakP>
      <OakP $mt={"space-between-m"}>
        These resources were created for remote use during the pandemic and are
        not designed for classroom teaching.
      </OakP>
    </>
  ) : (
    `We've made brand-new and improved lessons for you.`
  );

  return (
    <OakInlineBanner
      cta={
        <OakBox>
          <OakPrimaryButton
            element="a"
            iconName="arrow-right"
            isTrailingIcon
            href={onwardHref}
            onClick={onViewNewLessons}
          >
            {`View new ${isResourcesMessage ? "resources" : "lessons"}`}
          </OakPrimaryButton>
        </OakBox>
      }
      isOpen={isOpen}
      message={message}
      title={title}
      type="warning"
      variant="large"
    />
  );
};
