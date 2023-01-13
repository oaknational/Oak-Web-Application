import { FC } from "react";

import useClickableCard from "../../../../hooks/useClickableCard";
import Flex from "../../../Flex";
import { Span } from "../../../Typography";
import { SearchResultsListProps } from "../../LessonList/LessonListItem/LessonListItem";
import IconMobile from "../../IconMobile";
import ListItemHeading from "../../ListItemHeading";
import ListItemCard from "../../ListItemCard";

export type UnitListItemProps = {
  title: string;
  slug: string;
  themeTitle: string | null;
  lessonCount: number | null;
  quizCount: number | null;
  subjectSlug: string;
  keyStageSlug: string;
  hideTopHeading?: boolean;
} & SearchResultsListProps;

/**
 * Contains an title, icon, leaning theme, number of lessons and optional Unit Quiz .
 * Links to a lesson-index page
 *
 *
 */
const UnitListItem: FC<UnitListItemProps> = (props) => {
  const { title, themeTitle, lessonCount, quizCount } = props;

  const { isHovered, primaryTargetProps, containerProps } =
    useClickableCard<HTMLAnchorElement>();

  return (
    <ListItemCard
      title={title}
      isHovered={isHovered}
      containerProps={containerProps}
      background={"pupilsPink"}
    >
      <Flex
        $ml={[16, 24]}
        $mr={[0, 24]}
        $flexDirection={"column"}
        $width={"100%"}
      >
        <Flex>
          <ListItemHeading
            {...props}
            primaryTargetProps={primaryTargetProps}
            page={"Unit"}
          />
          <IconMobile background={"pupilsPink"} title={title} />
        </Flex>

        <Flex $mb={24} $flexDirection={["column", "row"]}>
          {themeTitle && (
            <Span $mr={16} $mb={[4, 0]} $font={["body-3", "heading-light-7"]}>
              {themeTitle}
            </Span>
          )}
          <Flex>
            {lessonCount && (
              <Span $mr={16} $font={["body-3", "heading-light-7"]}>
                {`${lessonCount} lessons`}
              </Span>
            )}
            {quizCount && (
              <Span $mr={16} $font={["body-3", "heading-light-7"]}>
                Unit quiz
              </Span>
            )}
          </Flex>
        </Flex>
      </Flex>
    </ListItemCard>
  );
};

export default UnitListItem;
