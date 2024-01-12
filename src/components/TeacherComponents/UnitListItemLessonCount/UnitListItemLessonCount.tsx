import Flex from "@/components/SharedComponents/Flex";
import Icon from "@/components/SharedComponents/Icon";
import { Span } from "@/components/SharedComponents/Typography";

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
      <Flex $alignItems={"end"}>
        {lessonCount && expiredLessonCount ? (
          <Span $font={["body-3", "heading-light-7"]} $color={textColor}>
            {`${lessonCount - expiredLessonCount}/${lessonCount} lessons`}
          </Span>
        ) : (
          <Span $font={["body-3", "heading-light-7"]} $color={textColor}>
            {!!lessonCount &&
              `${lessonCount} ${lessonCount > 1 ? "lessons" : "lesson"}`}
            {expired && ` Coming soon`}
          </Span>
        )}

        {!expired && lessonCount && <Icon name="chevron-right" size={20} />}
      </Flex>
    </>
  );
};
