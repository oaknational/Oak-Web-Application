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
        return `These resources were made for remote use during the pandemic, not classroom teaching.`;
      case isSingular:
        return `This lesson was made for home learning during the pandemic.`;
      default:
        return `These lessons were made for home learning during the pandemic.`;
    }
  })();

  const message = isResourcesMessage ? (
    <>
      <OakP>
        Switch to our new teaching resources now - designed by teachers and
        leading subject experts, and tested in classrooms.
      </OakP>
    </>
  ) : (
    `We've made brand-new and improved ${isSingular ? "lessons" : "resources"} for you.`
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
