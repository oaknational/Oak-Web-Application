import { FC } from "react";

import useClickableCard from "../../../../hooks/useClickableCard";
import Flex from "../../../Flex";
import BoxBorders from "../../../SpriteSheet/BrushSvgs/BoxBorders";
import Card from "../../../Card";
import LineClamp from "../../../LineClamp";
import LessonResourceGraphics from "../../../LessonResourceGraphics";
import Box from "../../../Box";
import { TeachersKeyStageSubjectUnitsLessonsData } from "../../../../node-lib/curriculum-api";
import IconMobile from "../../IconMobile";
import IconDesktop from "../../IconDesktop";
import ListItemHeading from "../../ListItemHeading";
import { Span } from "../../../Typography";

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
    description,
    quizCount,
    videoCount,
    presentationCount,
    worksheetCount,
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
            <ListItemHeading
              {...props}
              primaryTargetProps={primaryTargetProps}
              page={"Lesson"}
            />
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
