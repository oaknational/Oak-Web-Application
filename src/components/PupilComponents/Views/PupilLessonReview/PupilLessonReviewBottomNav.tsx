import {
  OakLessonBottomNav,
  OakPrimaryButton,
} from "@oaknational/oak-components";

export type PupilLessonReviewBottomNavProps = {
  href?: string;
  label?: string;
};

export const PupilLessonReviewBottomNav = ({
  href,
  label = "View all lessons",
}: PupilLessonReviewBottomNavProps) => {
  if (!href) {
    return null;
  }

  return (
    <OakLessonBottomNav>
      <OakPrimaryButton
        element="a"
        href={href}
        iconName="arrow-right"
        isTrailingIcon
        width={["100%", "max-content"]}
      >
        {label}
      </OakPrimaryButton>
    </OakLessonBottomNav>
  );
};
