import { FC, MutableRefObject } from "react";
import { useRouter } from "next/router";

import useClickableCard from "../../../../hooks/useClickableCard";
import useAnalytics from "../../../../context/Analytics/useAnalytics";
import Flex from "../../../Flex";
import ListItemHeader from "../../ListItemHeader";
import ListItemCard from "../../ListItemCard";
import { UnitListingData } from "../../../../node-lib/curriculum-api";
import type { KeyStageTitleValueType } from "../../../../browser-lib/avo/Avo";
import useAnalyticsPageProps from "../../../../hooks/useAnalyticsPageProps";
import { getSortedSearchFiltersSelected } from "../../../../context/Search/helpers";
import ListItemIndexDesktop from "../../ListItemIndexDesktop";
import ListItemIndexMobile from "../../ListItemIndexMobile";
import ListItemIconMobile from "../../ListItemIconMobile";
import ListItemIconDesktop from "../../ListItemIconDesktop";

import { UnitListLessonCount } from "./UnitListLessonCount";

export type UnitListItemProps = Omit<
  UnitListingData["units"][number][number],
  "year" | "unitStudyOrder"
> & {
  hideTopHeading?: boolean;
  hitCount?: number;
  fromSearchPage?: boolean;
  index: number;
  currentPage?: number;
  firstItemRef?: MutableRefObject<HTMLAnchorElement | null> | null;
};

/**
 * Contains an title, icon, learning theme, number of lessons and optional Unit Quiz .
 * Links to a lesson-index page
 *
 **/
const UnitListItem: FC<UnitListItemProps> = (props) => {
  const {
    title,
    slug,
    lessonCount,
    index,
    expired,
    expiredLessonCount,
    subjectSlug,
    subjectTitle,
    keyStageSlug,
    keyStageTitle,
    fromSearchPage,
    hitCount,
    currentPage,
    firstItemRef,
  } = props;
  const router = useRouter();
  const { track } = useAnalytics();
  const { analyticsUseCase } = useAnalyticsPageProps();

  const trackUnitSelected = () => {
    if (fromSearchPage && hitCount && currentPage) {
      track.searchResultClicked({
        keyStageSlug: keyStageSlug,
        keyStageTitle: keyStageTitle as KeyStageTitleValueType,
        subjectTitle: subjectTitle,
        subjectSlug: subjectSlug,
        unitName: title.replace(/(<([^>]+)>)/gi, ""), // unit name without highlighting html tags,
        unitSlug: slug,
        analyticsUseCase: analyticsUseCase,
        searchRank: (currentPage - 1) * 20 + index + 1,
        searchFilterOptionSelected: getSortedSearchFiltersSelected(
          router.query.keyStages
        ),
        searchResultCount: hitCount,
        searchResultType: "unit",
        lessonName: undefined,
        lessonSlug: undefined,
      });
    } else {
      track.unitSelected({
        keyStageTitle: keyStageTitle as KeyStageTitleValueType,
        keyStageSlug,
        subjectTitle,
        subjectSlug,
        unitName: title,
        unitSlug: slug,
        analyticsUseCase,
      });
    }
  };

  const { isHovered, primaryTargetProps, containerProps } =
    useClickableCard<HTMLAnchorElement>(firstItemRef);

  const background = expired ? "oakGrey2" : "teachersLilac";

  return (
    <ListItemCard
      title={title}
      subjectSlug={subjectSlug}
      isHovered={isHovered}
      containerProps={containerProps}
      background={expired ? "oakGrey1" : "white"}
      expired={expired}
      index={index}
      fromSearchPage={fromSearchPage}
    >
      {!fromSearchPage && (
        <>
          <ListItemIndexDesktop
            index={index + 1}
            background={background}
            expired
          />
          <ListItemIndexMobile background={background} index={index + 1} />
        </>
      )}
      <Flex
        $ml={[16, 24]}
        $mr={[0, 24]}
        $flexDirection={"column"}
        $justifyContent={"center"}
        $width={"100%"}
        $height={"100%"}
        $gap={"8px"}
        $pv={[8, 12]}
      >
        <ListItemHeader
          {...props}
          primaryTargetProps={primaryTargetProps}
          page={"Unit"}
          index={index}
          onClick={trackUnitSelected}
          fromSearchPage={fromSearchPage}
          firstItemRef={firstItemRef}
        />

        <Flex $flexDirection={["column", "row"]}>
          <UnitListLessonCount
            expired={expired}
            expiredLessonCount={expiredLessonCount}
            lessonCount={lessonCount}
          />
        </Flex>
      </Flex>
      {fromSearchPage && (
        <>
          <ListItemIconDesktop
            title={title}
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

export default UnitListItem;
