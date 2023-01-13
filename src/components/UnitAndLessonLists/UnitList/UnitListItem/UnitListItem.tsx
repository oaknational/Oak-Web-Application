import { FC } from "react";

import useClickableCard from "../../../../hooks/useClickableCard";
import Flex from "../../../Flex";
import { Heading, Span } from "../../../Typography";
import BoxBorders from "../../../SpriteSheet/BrushSvgs/BoxBorders";
import Card from "../../../Card";
import OakLink from "../../../OakLink";
import { SearchResultsListProps } from "../../LessonList/LessonListItem/LessonListItem";
import CategoryHeading from "../../CategoryHeading";
import IconDesktop from "../../IconDesktop";
import IconMobile from "../../IconMobile";

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
  const {
    title,
    themeTitle,
    lessonCount,
    quizCount,
    subjectSlug,
    keyStageSlug,
    slug,
    hideTopHeading,
    keyStageTitle,
    subjectTitle,
  } = props;

  const { containerProps, isHovered, primaryTargetProps } =
    useClickableCard<HTMLAnchorElement>();

  return (
    <Card
      $justifyContent={"space-between"}
      $flexDirection={"row"}
      $mb={16}
      $overflow={"hidden"}
      {...containerProps}
      $pa={0}
    >
      <Flex
        $transform={isHovered ? "translateY(-4px)" : null}
        $transition={"all 0.4s ease-out"}
        $width={"100%"}
        $position={"relative"}
        $flexDirection={"row"}
        $justifyContent={"space-between"}
        $dropShadow={isHovered ? "subjectCardHover" : "subjectCard"}
        $alignItems={"center"}
      >
        <Flex
          $ml={[16, 24]}
          $mr={[0, 24]}
          $flexDirection={"column"}
          $width={"100%"}
        >
          <Flex>
            <Flex $mt={24} $flexDirection={"column"}>
              {!hideTopHeading && (
                <CategoryHeading
                  keyStageTitle={keyStageTitle}
                  subjectTitle={subjectTitle}
                  page={"Unit"}
                />
              )}

              <OakLink
                slug={slug}
                keyStage={keyStageSlug}
                subject={subjectSlug}
                page={"lesson-index"}
                {...primaryTargetProps}
              >
                <Heading $mb={12} $font={["heading-7", "heading-6"]} tag={"h3"}>
                  {title}
                </Heading>
              </OakLink>
            </Flex>
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
      </Flex>
      <IconDesktop
        title={title}
        background={"pupilsPink"}
        isHovered={isHovered}
      />
      <BoxBorders gapPosition="bottomRightCorner" />
    </Card>
  );
};

export default UnitListItem;
