import { FC } from "react";

import useClickableCard from "../../../hooks/useClickableCard";
import Flex from "../../Flex";
import Icon, { IconName } from "../../Icon";
import { Heading, Span } from "../../Typography";
import { OakColorName } from "../../../styles/theme/types";
import BoxBorders from "../../SpriteSheet/BrushSvgs/BoxBorders";
import Card from "../../Card";
import OakLink from "../../OakLink";

export type UnitListItemProps = {
  title: string;
  slug: string;
  learningThemeTitle?: string;
  lessonCount: number;
  hasUnitQuiz: boolean;
  subjectIcon: IconName;
  background: OakColorName;
};

/**
 * Contains an image, title, and text summary.
 * The component contains a link styled as a button, which
 * whose click target stretches across the entire component.
 * The title tag (h1, h2, ...) is passed as a prop.
 */
const UnitListItem: FC<UnitListItemProps> = (props) => {
  const {
    title,
    learningThemeTitle,
    lessonCount,
    hasUnitQuiz,
    subjectIcon,
    slug,
  } = props;

  const { containerProps, isHovered, primaryTargetProps } =
    useClickableCard<HTMLAnchorElement>();

  return (
    <Card $mb={16} $overflow={"hidden"} {...containerProps} $pa={0}>
      <Flex
        $transform={isHovered ? "translateY(-4px)" : null}
        $transition={"all 0.4s ease-out"}
        $width={"100%"}
        $position={"relative"}
        $flexDirection={"row"}
        $justifyContent={"space-between"}
        $alignItems={"center"}
        $pa={0}
        $dropShadow={isHovered ? "subjectCardHover" : "subjectCard"}
      >
        <Flex $mh={[16, 24]} $flexDirection={"column"}>
          <OakLink slug={slug} page={"unit"} {...primaryTargetProps}>
            <Heading $mb={12} $font={["heading-7", "heading-6"]} tag={"h3"}>
              {title}
            </Heading>
          </OakLink>
          <Flex $flexDirection={["column", "row"]}>
            {learningThemeTitle && (
              <Span $mr={6} $font={["body-3", "heading-light-7"]}>
                {learningThemeTitle}
              </Span>
            )}
            <Flex>
              <Span $mr={6} $font={["body-3", "heading-light-7"]}>
                {`${lessonCount} lessons`}
              </Span>
              {hasUnitQuiz && (
                <Span $mr={6} $font={["body-3", "heading-light-7"]}>
                  and unit quiz
                </Span>
              )}
            </Flex>
          </Flex>
        </Flex>
        <Flex
          $justifyContent={"center"}
          $alignItems={"center"}
          $minHeight={110}
          $minWidth={[72, 130]}
          $background={"pupilsPink"}
          $position={"relative"}
        >
          <Icon size={[50, 92]} name={subjectIcon}>
            {title}
          </Icon>
        </Flex>
      </Flex>
      <BoxBorders gapPosition="bottomRight" />
    </Card>
  );
};

export default UnitListItem;
