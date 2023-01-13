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

  const { isHovered, primaryTargetProps } =
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
      background={"teachersLilac"}
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
    </ListItemCard>
  );
};

export default LessonListItem;
