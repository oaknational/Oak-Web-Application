import { FC } from "react";

import useClickableCard from "../../../../hooks/useClickableCard";
import Flex from "../../../Flex";
import { Span } from "../../../Typography";
import IconMobile from "../../IconMobile";
import ListItemHeading from "../../ListItemHeading";
import ListItemCard from "../../ListItemCard";
import { TeachersKeyStageSubjectUnitsData } from "../../../../node-lib/curriculum-api";
import Expired from "../../Expired";

export type UnitListItemProps = Omit<
  TeachersKeyStageSubjectUnitsData["units"][number],
  "year" | "unitStudyOrder"
> & {
  hideTopHeading?: boolean;
  index: number | null;
};

/**
 * Contains an title, icon, leaning theme, number of lessons and optional Unit Quiz .
 * Links to a lesson-index page
 *
 *
 */
const UnitListItem: FC<UnitListItemProps> = (props) => {
  const {
    title,
    themeTitle,
    lessonCount,
    quizCount,
    index,
    expired,
    expiredLessonCount,
  } = props;

  const { isHovered, primaryTargetProps, containerProps } =
    useClickableCard<HTMLAnchorElement>();

  return (
    <ListItemCard
      title={title}
      isHovered={expired ? false : isHovered}
      containerProps={containerProps}
      background={"teachersLilac"}
      expired={expired}
    >
      <Flex
        $ml={[16, 24]}
        $mr={[0, 24]}
        $flexDirection={"column"}
        $width={"100%"}
        $pb={24}
      >
        <Flex>
          <ListItemHeading
            {...props}
            primaryTargetProps={primaryTargetProps}
            page={"Unit"}
            index={index}
          />
          <IconMobile background={"teachersLilac"} title={title} />
        </Flex>

        {expired ? (
          <Expired page={"unit"} />
        ) : (
          <Flex $flexDirection={["column", "row"]}>
            {themeTitle && (
              <Span
                dangerouslySetInnerHTML={{
                  __html: themeTitle,
                }}
                $mr={16}
                $mb={[4, 0]}
                $font={["body-3", "heading-light-7"]}
              />
            )}
            <Flex>
              {lessonCount && expiredLessonCount ? (
                <Span $mr={16} $font={["body-3", "heading-light-7"]}>
                  {`${lessonCount - expiredLessonCount}/${lessonCount} lessons`}
                </Span>
              ) : (
                <Span $mr={16} $font={["body-3", "heading-light-7"]}>
                  {lessonCount && `${lessonCount} lessons`}
                </Span>
              )}
              {quizCount && (
                <Span $mr={16} $font={["body-3", "heading-light-7"]}>
                  Unit quiz
                </Span>
              )}
            </Flex>
          </Flex>
        )}
      </Flex>
    </ListItemCard>
  );
};

export default UnitListItem;
