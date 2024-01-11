import React, { FC, MutableRefObject } from "react";

import ListItemIconMobile from "@/components/UnitAndLessonLists/ListItemIconMobile";
import ListItemIconDesktop from "@/components/UnitAndLessonLists/ListItemIconDesktop";
import { OakColorName } from "@/styles/theme/types";
import useClickableCard from "@/hooks/useClickableCard";
import Flex from "@/components/SharedComponents/Flex";
import ListItemHeader from "@/components/UnitAndLessonLists/ListItemHeader";
import ListItemCard from "@/components/UnitAndLessonLists/ListItemCard";
import { UnitListingData, UnitData } from "@/node-lib/curriculum-api";
import ListItemIndexDesktop from "@/components/UnitAndLessonLists/ListItemIndexDesktop";
import ListItemIndexMobile from "@/components/UnitAndLessonLists/ListItemIndexMobile";
import { UnitListItemLessonCount } from "@/components/TeacherComponents/UnitListItemLessonCount";
import { Span } from "@/components/SharedComponents/Typography";

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
    onClick,
  } = props;

  const { isHovered, primaryTargetProps, containerProps } =
    useClickableCard<HTMLAnchorElement>(firstItemRef);

  const background: OakColorName = expired ? "grey30" : "lavender50";
  const backgroundOnHover: OakColorName = "lavender";

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
          <UnitListItemLessonCount
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
