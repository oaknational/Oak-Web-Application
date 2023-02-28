import { FC } from "react";

import useClickableCard from "../../../../hooks/useClickableCard";
import Flex from "../../../Flex";
import LessonResourceGraphics from "../../../LessonResourceGraphics";
import Box from "../../../Box";
import { TeachersKeyStageSubjectUnitsLessonsData } from "../../../../node-lib/curriculum-api";
import IconMobile from "../../IconMobile";
import ListItemHeading from "../../ListItemHeading";
import { Span } from "../../../Typography";
import ListItemCard from "../../ListItemCard";
import { LessonResourceGraphicsItemProps } from "../../../LessonResourceGraphics/LessonResourceGraphicsItem";

export type LessonListItemProps =
  TeachersKeyStageSubjectUnitsLessonsData["lessons"][number] & {
    hideTopHeading?: boolean;
  };

function getAvailableResourceList({
  quizCount,
  videoCount,
  presentationCount,
  worksheetCount,
  hasCopyrightMaterial,
}: LessonListItemProps) {
  const resources: LessonResourceGraphicsItemProps[] = [];

  if (presentationCount && !hasCopyrightMaterial) {
    resources.push({
      titleSingular: "Slide decks",
      titlePlural: "Slide deck",
      icon: "slide-deck",
      resourceCount: presentationCount,
    });
  }

  if (worksheetCount) {
    resources.push({
      titleSingular: "Worksheets",
      titlePlural: "Worksheets",
      icon: "worksheet",
      resourceCount: worksheetCount,
    });
  }

  if (quizCount) {
    resources.push({
      titleSingular: "Quiz",
      titlePlural: "Quizzes",
      icon: "quiz",
      resourceCount: quizCount,
    });
  }

  if (videoCount) {
    resources.push({
      titleSingular: "Video",
      titlePlural: "Videos",
      icon: "video",
      resourceCount: videoCount,
    });
  }

  return resources;
}

/**
 * Contains a lesson title, description, icon, and icons for resources
 * Links to a lesson-index page
 */
const LessonListItem: FC<LessonListItemProps> = (props) => {
  const { title, description } = props;

  const { isHovered, primaryTargetProps, containerProps } =
    useClickableCard<HTMLAnchorElement>();

  const resources = getAvailableResourceList(props);

  return (
    <ListItemCard
      title={title}
      isHovered={isHovered}
      background={"pupilsPink"}
      containerProps={containerProps}
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
            page="Lesson"
            index={null}
          />
          <IconMobile background={"pupilsPink"} title={title} />
        </Flex>

        <Flex $mt={[8, 0]} $mr={[16, 0]}>
          <Span
            dangerouslySetInnerHTML={{
              __html: description,
            }}
            $font={["body-3", "body-2"]}
            $color={"oakGrey5"}
          />
        </Flex>
        {resources.length > 0 && (
          <Box $mt={16}>
            <LessonResourceGraphics items={resources} />
          </Box>
        )}
      </Flex>
    </ListItemCard>
  );
};

export default LessonListItem;
