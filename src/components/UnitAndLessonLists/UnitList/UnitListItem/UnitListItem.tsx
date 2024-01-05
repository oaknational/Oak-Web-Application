import React, { FC, MutableRefObject } from "react";

import ListItemIconMobile from "../../ListItemIconMobile";
import ListItemIconDesktop from "../../ListItemIconDesktop";

import { OakColorName } from "@/styles/theme/types";
import useClickableCard from "@/hooks/useClickableCard";
import Flex from "@/components/SharedComponents/Flex";
import ListItemHeader from "@/components/UnitAndLessonLists/ListItemHeader";
import ListItemCard from "@/components/UnitAndLessonLists/ListItemCard";
import { UnitListingData, UnitData } from "@/node-lib/curriculum-api";
import ListItemIndexDesktop from "@/components/UnitAndLessonLists/ListItemIndexDesktop";
import ListItemIndexMobile from "@/components/UnitAndLessonLists/ListItemIndexMobile";
import { UnitListLessonCount } from "@/components/UnitAndLessonLists/UnitList/UnitListItem/UnitListLessonCount";
import { Span } from "@/components/Typography";

export type UnitListItemProps = Omit<
  UnitListingData["units"][number][number],
  "year" | "unitStudyOrder"
> & {
  hideTopHeading?: boolean;
  hitCount?: number;
  index: number;
  currentPage?: number;
  firstItemRef?: MutableRefObject<HTMLAnchorElement | null> | null;
  isUnitOption?: boolean;
  unitOptions?: UnitData[];
  isExemplarUnit?: boolean;
  subjectIconBackground?: OakColorName;
  yearTitle?: string | null;
  onClick: (props: UnitListItemProps) => void;
};

/**
 * Contains an title, icon, learning theme, number of lessons and optional Unit Quiz .
 * Links to a lesson-index page
 *
 **/
const UnitListItem: FC<UnitListItemProps> = (props) => {
  const {
    title,
    lessonCount,
    index,
    expired,
    expiredLessonCount,
    subjectSlug,
    firstItemRef,
    isUnitOption,
    yearTitle,
    isExemplarUnit,
    subjectIconBackground,
    onClick,
  } = props;

  const { isHovered, primaryTargetProps, containerProps } =
    useClickableCard<HTMLAnchorElement>(firstItemRef);

  let background: OakColorName = expired ? "grey30" : "lavender50";
  let backgroundOnHover: OakColorName = "lavender";

  // This override is for the units on the early-release units page which use different shades of pink/blue
  if (subjectIconBackground) {
    background = subjectIconBackground;
    backgroundOnHover =
      subjectIconBackground === "pink"
        ? "pink60"
        : subjectIconBackground === "lavender"
        ? "lavender60"
        : subjectIconBackground;
  }

  return (
    <ListItemCard
      title={title}
      subjectSlug={subjectSlug}
      isHovered={isHovered}
      containerProps={containerProps}
      background={expired ? "grey20" : "white"}
      expired={expired}
      index={index}
      isUnitOption={isUnitOption}
    >
      {!isExemplarUnit && !isUnitOption && (
        <>
          <ListItemIndexDesktop
            index={index + 1}
            background={isHovered ? backgroundOnHover : background}
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
        $flexDirection={"column"}
        $justifyContent={"space-between"}
        $width={"100%"}
        $height={"100%"}
        $gap={[8]}
        $pa={16}
      >
        {!isUnitOption && yearTitle && !isExemplarUnit && (
          <Span $font={"heading-light-7"} $color={"grey60"} $mv={0}>
            {yearTitle}
          </Span>
        )}
        <ListItemHeader
          {...props}
          primaryTargetProps={primaryTargetProps}
          page={"Unit"}
          index={index}
          onClick={() =>
            onClick({
              ...props,
            })
          }
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
      {isExemplarUnit && (
        <>
          <ListItemIconDesktop
            title={title}
            background={isHovered ? backgroundOnHover : background}
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
