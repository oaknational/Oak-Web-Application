import { FC } from "react";

import useClickableCard from "../../../../hooks/useClickableCard";
import Flex from "../../../Flex";
import LineClamp from "../../../LineClamp";
import LessonResourceGraphics from "../../../LessonResourceGraphics";
import Box from "../../../Box";
import { TeachersKeyStageSubjectUnitsLessonsData } from "../../../../node-lib/curriculum-api";
import IconMobile from "../../IconMobile";
import ListItemHeading from "../../ListItemHeading";
import { Span } from "../../../Typography";
import ListItemCard from "../../ListItemCard";

export type LessonListItemProps =
  TeachersKeyStageSubjectUnitsLessonsData["lessons"][number];

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

  const { isHovered, primaryTargetProps, containerProps } =
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
          />
          <IconMobile background={"pupilsPink"} title={title} />
        </Flex>

        <Flex $display={["none", "flex"]}>
          <LineClamp lines={2}>
            <Span $font={"body-2"} $color={"oakGrey5"}>
              {description}
            </Span>
          </LineClamp>
        </Flex>
        <Flex $display={["flex", "none"]} $mt={8} $mr={16}>
          <LineClamp lines={5}>
            <Span $font={"body-2"} $color={"oakGrey5"}>
              {description}
            </Span>
          </LineClamp>
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
