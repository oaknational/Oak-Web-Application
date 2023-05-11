import { FC } from "react";
import { useRouter } from "next/router";

import useClickableCard from "../../../../hooks/useClickableCard";
import useAnalytics from "../../../../context/Analytics/useAnalytics";
import Flex from "../../../Flex";
import LessonResourceGraphics from "../../../LessonResourceGraphics";
import Box from "../../../Box";
import { LessonListing } from "../../../../node-lib/curriculum-api";
import ListItemHeader from "../../ListItemHeader";
import { Span } from "../../../Typography";
import ListItemCard from "../../ListItemCard";
import Expired from "../../Expired";
import { LessonResourceGraphicsItemProps } from "../../../LessonResourceGraphics/LessonResourceGraphicsItem";
import type { KeyStageTitleValueType } from "../../../../browser-lib/avo/Avo";
import useAnalyticsPageProps from "../../../../hooks/useAnalyticsPageProps";
import { getSortedSearchFiltersSelected } from "../../../../context/Search/helpers";

export type LessonListItemProps = LessonListing["lessons"][number] & {
  unitTitle: string;
  hideTopHeading?: boolean;
  hitCount?: number;
  fromSearchPage?: boolean;
  index: number;
  currentPage?: number;
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
    lessonTitle,
    lessonSlug,
    description,
    expired,
    subjectTitle,
    subjectSlug,
    keyStageSlug,
    keyStageTitle,
    unitSlug,
    unitTitle,
    fromSearchPage,
    index,
    hitCount,
    currentPage,
  } = props;
  const router = useRouter();
  const { track } = useAnalytics();

  const { analyticsUseCase } = useAnalyticsPageProps();

  const trackLessonSelected = () => {
    if (fromSearchPage && hitCount && currentPage) {
      track.searchResultClicked({
        keyStageSlug: keyStageSlug,
        keyStageTitle: keyStageTitle as KeyStageTitleValueType,
        subjectTitle: subjectTitle,
        subjectSlug: subjectSlug,
        unitName: unitTitle.replace(/(<([^>]+)>)/gi, ""), // unit name without highlighting html tags
        unitSlug: unitSlug,
        lessonName: lessonTitle,
        lessonSlug: lessonSlug,
        analyticsUseCase: analyticsUseCase,
        searchRank: (currentPage - 1) * 20 + index + 1,
        searchFilterOptionSelected: getSortedSearchFiltersSelected(
          router.query.keyStages
        ),
        searchResultCount: hitCount,
        searchResultType: "lesson",
      });
    } else {
      track.lessonSelected({
        keyStageTitle: keyStageTitle as KeyStageTitleValueType,
        keyStageSlug,
        subjectTitle,
        subjectSlug,
        unitName: unitTitle,
        unitSlug,
        lessonName: lessonTitle,
        lessonSlug,
        analyticsUseCase,
      });
    }
  };

  const { isHovered, primaryTargetProps, containerProps } =
    useClickableCard<HTMLAnchorElement>();

  const resources = getAvailableResourceList(props);

  return (
    <ListItemCard
      title={lessonTitle}
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
          index={index}
          onClick={trackLessonSelected}
          title={lessonTitle}
          slug={lessonSlug}
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
