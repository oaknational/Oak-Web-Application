import React, { FC, MutableRefObject } from "react";
import { useRouter } from "next/router";

import { OakColorName } from "../../../../styles/theme/types";

import useClickableCard from "@/hooks/useClickableCard";
import useAnalytics from "@/context/Analytics/useAnalytics";
import Flex from "@/components/Flex";
import ListItemHeader from "@/components/UnitAndLessonLists/ListItemHeader";
import ListItemCard from "@/components/UnitAndLessonLists/ListItemCard";
import { UnitListingData, UnitData } from "@/node-lib/curriculum-api";
import type { KeyStageTitleValueType } from "@/browser-lib/avo/Avo";
import useAnalyticsPageProps from "@/hooks/useAnalyticsPageProps";
import ListItemIndexDesktop from "@/components/UnitAndLessonLists/ListItemIndexDesktop";
import ListItemIndexMobile from "@/components/UnitAndLessonLists/ListItemIndexMobile";
import ListItemIconMobile from "@/components/UnitAndLessonLists/ListItemIconMobile";
import ListItemIconDesktop from "@/components/UnitAndLessonLists/ListItemIconDesktop";
import { UnitListLessonCount } from "@/components/UnitAndLessonLists/UnitList/UnitListItem/UnitListLessonCount";
import { P } from "@/components/Typography";
import { getSortedSearchFiltersSelected } from "@/context/Search/search.helpers";

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
  isUnitOption?: boolean;
  unitOptions?: UnitData[];
  isExemplarUnit?: boolean;
  subjectIconBackground?: OakColorName;
  yearTitle?: string | null;
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
    isUnitOption,
    yearTitle,
    isExemplarUnit,
    subjectIconBackground,
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
          router.query.keyStages,
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

  let background: OakColorName = "teachersLilac";

  if (expired) {
    background = "oakGrey2";
  } else if (subjectIconBackground) {
    background = subjectIconBackground;
  }

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
      isUnitOption={isUnitOption}
    >
      {!fromSearchPage && !isUnitOption && (
        <>
          <ListItemIndexDesktop
            index={index + 1}
            background={background}
            expired={expired}
          />
          <ListItemIndexMobile
            background={background}
            index={index + 1}
            expired={expired}
          />
        </>
      )}
      <Flex
        $ml={[16, 24]}
        $mr={[0, 24]}
        $flexDirection={"column"}
        $justifyContent={"space-between"}
        $width={"100%"}
        $height={"100%"}
        $gap={[8]}
        $pv={[8, 12]}
      >
        {!isUnitOption && yearTitle && !isExemplarUnit && (
          <P $font={"heading-light-7"} $color={"oakGrey4"} $mv={0}>
            {yearTitle}
          </P>
        )}
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
