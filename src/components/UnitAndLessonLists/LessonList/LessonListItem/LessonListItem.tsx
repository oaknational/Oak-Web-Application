import { FC, MutableRefObject } from "react";
import { useRouter } from "next/router";

import useClickableCard from "../../../../hooks/useClickableCard";
import useAnalytics from "../../../../context/Analytics/useAnalytics";
import Flex from "../../../Flex";
import LessonResourceGraphics from "../../../LessonResourceGraphics";
import Box from "../../../Box";
import ListItemHeader from "../../ListItemHeader";
import { P, Span } from "../../../Typography";
import ListItemCard from "../../ListItemCard";
import { LessonResourceGraphicsItemProps } from "../../../LessonResourceGraphics/LessonResourceGraphicsItem";
import type { KeyStageTitleValueType } from "../../../../browser-lib/avo/Avo";
import useAnalyticsPageProps from "../../../../hooks/useAnalyticsPageProps";
import { getSortedSearchFiltersSelected } from "../../../../context/Search/search.helpers";
import { LessonListingPageData } from "../../../../node-lib/curriculum-api-2023/queries/lessonListing/lessonListing.schema";
import ListItemIndexDesktop from "../../ListItemIndexDesktop";
import ListItemIndexMobile from "../../ListItemIndexMobile";
import ListItemIconDesktop from "../../ListItemIconDesktop";
import ListItemIconMobile from "../../ListItemIconMobile";

export type LessonListItemProps = LessonListingPageData["lessons"][number] & {
  programmeSlug: string;
  subjectSlug: string;
  subjectTitle: string;
  keyStageSlug: string;
  keyStageTitle: string;
  unitSlug: string;
  unitTitle: string;
  hideTopHeading?: boolean;
  hitCount?: number;
  fromSearchPage?: boolean;
  index: number;
  currentPage?: number;
  firstItemRef?: MutableRefObject<HTMLAnchorElement | null> | null;
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
    firstItemRef,
    pupilLessonOutcome,
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
          router.query.keyStages,
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
    useClickableCard<HTMLAnchorElement>(firstItemRef);

  const resources = getAvailableResourceList(props);

  const background = expired ? "oakGrey2" : "pupilsPink";

  return (
    <ListItemCard
      title={lessonTitle}
      subjectSlug={subjectSlug}
      index={index}
      fromSearchPage={fromSearchPage}
      isHovered={isHovered}
      background={expired ? "oakGrey1" : "white"}
      containerProps={containerProps}
      expired={expired}
    >
      {!fromSearchPage && (
        <ListItemIndexDesktop
          index={index + 1}
          background={background}
          expired={expired}
        />
      )}

      <Flex
        $ml={[0, 24]}
        $mr={[0, 24]}
        $flexDirection={"column"}
        $width={"100%"}
        $gap={[4, 12]}
        $pt={[0, 20]}
        $pb={20}
      >
        {fromSearchPage ? (
          <Flex $pl={[16, 0]} $pt={[20, 0]} $alignItems={"center"}>
            <ListItemHeader
              {...props}
              primaryTargetProps={primaryTargetProps}
              page="Lesson"
              index={index}
              onClick={trackLessonSelected}
              title={lessonTitle}
              slug={lessonSlug}
              fromSearchPage={fromSearchPage}
            />
          </Flex>
        ) : (
          <Flex $gap={[10]} $alignItems={"center"}>
            <ListItemIndexMobile background={background} index={index + 1} />
            <Flex $flexDirection={"column"} $height={"100%"}>
              <ListItemHeader
                {...props}
                primaryTargetProps={primaryTargetProps}
                page="Lesson"
                index={index}
                onClick={trackLessonSelected}
                title={lessonTitle}
                slug={lessonSlug}
                fromSearchPage={fromSearchPage}
              />
              {/* {expired && (
                <P $mt={8} $font={["body-3", "body-2"]}>
                  This lesson is currently unavailable.
                </P>
              )} */}
            </Flex>
          </Flex>
        )}

        <Flex $flexDirection={"column"} $gap={[12]} $ml={[16, 0]}>
          <Flex $mt={[8, 0]} $mr={[16, 0]}>
            {expired ? (
              <P $mt={8} $font={["body-3", "body-2"]}>
                This lesson is currently unavailable.
              </P>
            ) : (
              <>
                {description ? (
                  <Span
                    dangerouslySetInnerHTML={{
                      __html: description,
                    }}
                    $font={["body-3", "body-2"]}
                    $color={"oakGrey5"}
                  />
                ) : (
                  <P $font={["body-3", "body-2"]} $color={"oakGrey5"}>
                    {pupilLessonOutcome}
                  </P>
                )}
              </>
            )}
          </Flex>
          {resources.length > 0 && !expired && (
            <Box>
              <LessonResourceGraphics items={resources} />
            </Box>
          )}
        </Flex>
      </Flex>
      {fromSearchPage && (
        <>
          <ListItemIconDesktop
            title={lessonTitle}
            background={background}
            isHovered={isHovered}
            subjectSlug={subjectSlug}
          />
          <ListItemIconMobile
            background={background}
            subjectSlug={subjectSlug}
          />
        </>
      )}
    </ListItemCard>
  );
};

export default LessonListItem;
