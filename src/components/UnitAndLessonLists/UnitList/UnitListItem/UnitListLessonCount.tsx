import Flex from "../../../Flex";
import Icon from "../../../Icon";
import { Span } from "../../../Typography";

export interface IUnitListLessonCountProps {
  lessonCount: number | null;
  expiredLessonCount: number | null;
  expired: boolean | null;
}

export const UnitListLessonCount = ({
  lessonCount,
  expiredLessonCount,
  expired,
}: IUnitListLessonCountProps) => {
  const textColor = expired ? "oakGrey4" : "black";

  return (
    <>
      <Flex $alignItems={"end"}>
        {lessonCount && expiredLessonCount ? (
          <Span $font={["body-3", "heading-light-7"]} $color={textColor}>
            {`${lessonCount - expiredLessonCount}/${lessonCount} lessons`}
          </Span>
        ) : (
          <Span $font={["body-3", "heading-light-7"]} $color={textColor}>
            {!!lessonCount && `${lessonCount} lessons`}
            {expired && ` Coming soon`}
          </Span>
        )}

        {!expired && lessonCount && <Icon name="chevron-right" size={20} />}
      </Flex>
    </>
  );
};
