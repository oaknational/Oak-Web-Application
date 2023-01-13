import { FC } from "react";

import useClickableCard from "../../../../hooks/useClickableCard";
import Flex from "../../../Flex";
import { Heading, Span } from "../../../Typography";
import BoxBorders from "../../../SpriteSheet/BrushSvgs/BoxBorders";
import Card from "../../../Card";
import OakLink from "../../../OakLink";
import LineClamp from "../../../LineClamp";
import LessonResourceGraphics from "../../../LessonResourceGraphics";
import Box from "../../../Box";
import { TeachersKeyStageSubjectUnitsLessonsData } from "../../../../node-lib/curriculum-api";
import CategoryHeading from "../../CategoryHeading";
import IconMobile from "../../IconMobile";
import IconDesktop from "../../IconDesktop";

export type SearchResultsListProps = {
  keyStageTitle?: string;
  subjectTitle?: string;
  hideTopHeading?: boolean;
};

export type LessonListItemProps =
  TeachersKeyStageSubjectUnitsLessonsData["lessons"][number] &
    SearchResultsListProps;

/**
 * Contains a lesson title, description, icon, and icons for resources
 * Links to a lesson-index page
 */
const LessonListItem: FC<LessonListItemProps> = (props) => {
  const {
    title,
    slug,
    keyStageSlug,
    subjectSlug,
    subjectTitle,
    unitSlug,
    description,
    quizCount,
    videoCount,
    presentationCount,
    worksheetCount,
    hideTopHeading,
    keyStageTitle,
  } = props;

  const { containerProps, isHovered, primaryTargetProps } =
    useClickableCard<HTMLAnchorElement>();

  const resources = [];
  presentationCount &&
    resources.push({
      title: "presentation",
      resourceCount: presentationCount,
    });
  worksheetCount &&
    resources.push({ title: "worksheet", resourceCount: worksheetCount });
  quizCount && resources.push({ title: "quiz", resourceCount: quizCount });
  videoCount && resources.push({ title: "video", resourceCount: videoCount });

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
                  page={"Lesson"}
                />
              )}

              <OakLink
                slug={slug}
                keyStage={keyStageSlug}
                subject={subjectSlug}
                unit={unitSlug}
                page={"lesson-overview"}
                {...primaryTargetProps}
              >
                <Heading $mb={12} $font={["heading-7", "heading-6"]} tag={"h3"}>
                  {title}
                </Heading>
              </OakLink>
            </Flex>
            <IconMobile background={"teachersLilac"} title={title} />
          </Flex>

          <Flex $display={["none", "flex"]} $mb={16}>
            <LineClamp lines={2}>
              <Span $font={"body-2"} $color={"oakGrey5"}>
                {description}
              </Span>
            </LineClamp>
          </Flex>
          <Flex $display={["flex", "none"]} $mt={8} $mb={16} $mr={16}>
            <LineClamp lines={5}>
              <Span $font={"body-2"} $color={"oakGrey5"}>
                {description}
              </Span>
            </LineClamp>
          </Flex>
          <Box $mb={24}>
            <LessonResourceGraphics items={resources} />
          </Box>
        </Flex>
      </Flex>
      <IconDesktop
        title={title}
        background={"teachersLilac"}
        isHovered={isHovered}
      />
      <BoxBorders gapPosition="bottomRightCorner" />
    </Card>
  );
};

export default LessonListItem;
