import { FC } from "react";

import useClickableCard from "../../../../hooks/useClickableCard";
import useAnalytics from "../../../../context/Analytics/useAnalytics";
import useAnalyticsUseCase from "../../../../hooks/useAnalyticsUseCase";
import Flex from "../../../Flex";
import LessonResourceGraphics from "../../../LessonResourceGraphics";
import Box from "../../../Box";
import { TeachersKeyStageSubjectUnitsLessonsData } from "../../../../node-lib/curriculum-api";
import ListItemHeader from "../../ListItemHeader";
import { Span } from "../../../Typography";
import ListItemCard from "../../ListItemCard";
import Expired from "../../Expired";
import { LessonResourceGraphicsItemProps } from "../../../LessonResourceGraphics/LessonResourceGraphicsItem";
import type { KeyStageTitleValueType } from "../../../../browser-lib/avo/Avo";

export type LessonListItemProps =
  TeachersKeyStageSubjectUnitsLessonsData["lessons"][number] & {
    unitTitle: string;
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
      titleSingular: "Slide deck",
      titlePlural: "Slide decks",
      icon: "slide-deck",
      resourceCount: presentationCount,
    });
  }

  if (worksheetCount) {
    resources.push({
      titleSingular: "Worksheet",
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
  const {
    title,
    slug,
    description,
    expired,
    subjectTitle,
    subjectSlug,
    keyStageSlug,
    keyStageTitle,
    unitSlug,
    unitTitle,
  } = props;

  const { track } = useAnalytics();
  const analyticsUseCase = useAnalyticsUseCase();

  const trackLessonSelected = () => {
    track.lessonSelected({
      keyStageTitle: keyStageTitle as KeyStageTitleValueType,
      keyStageSlug,
      subjectTitle,
      subjectSlug,
      unitName: unitTitle,
      unitSlug,
      lessonName: title,
      lessonSlug: slug,
      analyticsUseCase,
    });
  };

  const { isHovered, primaryTargetProps, containerProps } =
    useClickableCard<HTMLAnchorElement>();

  const resources = getAvailableResourceList(props);

  return (
    <ListItemCard
      title={title}
      subjectSlug={subjectSlug}
      isHovered={isHovered}
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
        <ListItemHeader
          {...props}
          primaryTargetProps={primaryTargetProps}
          page="Lesson"
          index={null}
          onClick={trackLessonSelected}
        />
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
