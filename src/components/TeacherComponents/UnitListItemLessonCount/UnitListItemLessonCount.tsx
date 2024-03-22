import { OakSpan, OakFlex } from "@oaknational/oak-components";

import Icon from "@/components/SharedComponents/Icon";

export interface IUnitListItemLessonCountProps {
  lessonCount: number | null;
  expiredLessonCount: number | null;
  expired: boolean | null;
}

export const UnitListItemLessonCount = ({
  lessonCount,
  expiredLessonCount,
  expired,
}: IUnitListItemLessonCountProps) => {
  const textColor = expired ? "grey60" : "black";

  return (
    <>
      <OakFlex $alignItems={"end"}>
        {lessonCount && expiredLessonCount ? (
          <OakSpan $font={["body-3", "heading-light-7"]} $color={textColor}>
            {`${lessonCount - expiredLessonCount}/${lessonCount} lessons`}
          </OakSpan>
        ) : (
          <OakSpan $font={["body-3", "heading-light-7"]} $color={textColor}>
            {!!lessonCount &&
              `${lessonCount} ${lessonCount > 1 ? "lessons" : "lesson"}`}
          </OakSpan>
        )}

        {!expired && lessonCount && <Icon name="chevron-right" size={20} />}
      </OakFlex>
    </>
  );
};
