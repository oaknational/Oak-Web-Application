import { OakSpan, OakFlex, OakIcon } from "@oaknational/oak-components";
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
    <OakFlex $alignItems={"end"}>
      {lessonCount && expiredLessonCount ? (
        <OakSpan $font={["body-3", "heading-light-7"]} $color={textColor}>
          {`${lessonCount - expiredLessonCount}/${lessonCount} lessons`}
        </OakSpan>
      ) : (
        <OakSpan $font={["body-3", "heading-light-7"]} $color={textColor}>
          {!!lessonCount &&
            `${lessonCount} ${lessonCount > 1 ? "lessons" : "lesson"}`}
          {expired && `This unit is currently unavailable.`}
        </OakSpan>
      )}
      {!expired && lessonCount && (
        <OakIcon
          iconName="chevron-right"
          $width={"all-spacing-5"}
          $height={"all-spacing-5"}
        />
      )}
    </OakFlex>
  );
};
