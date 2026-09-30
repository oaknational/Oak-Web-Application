import { OakTertiaryInvertedButton } from "@oaknational/oak-components";

import { useReturnToLessonProps } from "../../../getReturnToLessonLink";
import { extractLessonAccessedPropsFromHref } from "../extractLessonAccessedPropsFromHref";

import { useTeacherBrowseAnalytics } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";
import { NewGutterMaxWidth } from "@/components/GenericPagesComponents/NewGutterMaxWidth";

export const BackToLessonButton = () => {
  const { lessonAccessed } = useTeacherBrowseAnalytics((store) => store.track);

  const returnToLessonProps = useReturnToLessonProps();

  if (!returnToLessonProps) {
    return null;
  }

  return (
    <NewGutterMaxWidth>
      <OakTertiaryInvertedButton
        element="a"
        href={returnToLessonProps.returnTo}
        iconName="arrow-left"
        onClick={() => {
          const lessonAccessedProps =
            extractLessonAccessedPropsFromHref(returnToLessonProps);
          if (lessonAccessedProps) {
            lessonAccessed(lessonAccessedProps);
          }
        }}
      >
        Back to lesson
      </OakTertiaryInvertedButton>
    </NewGutterMaxWidth>
  );
};
