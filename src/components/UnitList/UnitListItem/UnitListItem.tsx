import { FC } from "react";

import useClickableCard from "../../../hooks/useClickableCard";
import Flex from "../../Flex";
import Icon from "../../Icon";
import { Heading, Span } from "../../Typography";
import BoxBorders from "../../SpriteSheet/BrushSvgs/BoxBorders";
import Card from "../../Card";
import OakLink from "../../OakLink";

export type UnitListItemProps = {
  title: string;
  slug: string;
  themeTitle: string | null;
  lessonCount: number | null;
  quizCount: number | null;
  subjectSlug: string;
  keyStageSlug: string;
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
    subjectSlug,
    keyStageSlug,
    slug,
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
        <Flex $mh={[16, 24]} $flexDirection={"column"}>
          <OakLink
            keyStage={keyStageSlug}
            subject={subjectSlug}
            slug={slug}
            page={"lesson-index"}
            {...primaryTargetProps}
          >
            <Heading
              $mt={24}
              $mb={12}
              $font={["heading-7", "heading-6"]}
              tag={"h3"}
            >
              {title}
            </Heading>
          </OakLink>
          <Flex $mb={24} $flexDirection={["column", "row"]}>
            {themeTitle && (
              <Span $mr={16} $mb={[4, 0]} $font={["body-3", "heading-light-7"]}>
                {themeTitle}
              </Span>
            )}
            <Flex>
              <Span $mr={16} $font={["body-3", "heading-light-7"]}>
                {`${lessonCount} lessons`}
              </Span>
              {quizCount && (
                <Span $mr={16} $font={["body-3", "heading-light-7"]}>
                  Unit quiz
                </Span>
              )}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <Flex
        $justifyContent={"center"}
        $alignItems={"center"}
        $minHeight={110}
        $minWidth={[72, 130]}
        $background={"teachersLilac"}
        $position={"relative"}
        $dropShadow={isHovered ? "subjectCardHover" : "subjectCard"}
        $transform={isHovered ? "translateY(-4px)" : null}
        $transition={"all 0.4s ease-out"}
      >
        <Icon size={[50, 92]} name={"Rocket"}>
          {title}
        </Icon>
      </Flex>
      <BoxBorders gapPosition="bottomRight" />
    </Card>
  );
};

export default UnitListItem;
