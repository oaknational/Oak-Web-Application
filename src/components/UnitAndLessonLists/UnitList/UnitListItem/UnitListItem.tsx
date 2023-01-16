import { FC } from "react";

import useClickableCard from "../../../../hooks/useClickableCard";
import Flex from "../../../Flex";
import { Span } from "../../../Typography";
import IconMobile from "../../IconMobile";
import ListItemHeading from "../../ListItemHeading";
import ListItemCard from "../../ListItemCard";
import { TeachersKeyStageSubjectUnitsData } from "../../../../node-lib/curriculum-api";

export type UnitListItemProps =
  TeachersKeyStageSubjectUnitsData["units"][number] & {
    hideTopHeading: boolean;
  };

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
      background={"teachersLilac"}
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
          />
          <IconMobile background={"teachersLilac"} title={title} />
        </Flex>

        <Flex $flexDirection={["column", "row"]}>
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
