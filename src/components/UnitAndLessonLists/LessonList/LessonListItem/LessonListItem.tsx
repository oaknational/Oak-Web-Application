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
import Expired from "../../Expired";

export type LessonListItemProps =
  TeachersKeyStageSubjectUnitsLessonsData["lessons"][number] & {
    hideTopHeading?: boolean;
  };

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
    hasCopyrightMaterial,
    expired,
  } = props;

  const { isHovered, primaryTargetProps, containerProps } =
    useClickableCard<HTMLAnchorElement>();

  const resources = [];
  presentationCount &&
    !hasCopyrightMaterial &&
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
      isHovered={expired ? false : isHovered}
      background={"pupilsPink"}
      containerProps={containerProps}
      expired={expired}
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

        {expired ? (
          <Expired page={"lesson"} />
        ) : (
          <>
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
          </>
        )}
      </Flex>
    </ListItemCard>
  );
};

export default LessonListItem;
