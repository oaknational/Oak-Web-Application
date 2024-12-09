import React, { FC, MutableRefObject } from "react";
import { OakSpan, OakFlex } from "@oaknational/oak-components";

import { OakColorName } from "@/styles/theme/types";
import useClickableCard from "@/hooks/useClickableCard";
import ListItemHeader from "@/components/TeacherComponents/ListItemHeader";
import ListItemCard from "@/components/TeacherComponents/ListItemCard";
import ListItemIndexDesktop from "@/components/TeacherComponents/ListItemIndexDesktop";
import ListItemIndexMobile from "@/components/TeacherComponents/ListItemIndexMobile";
import { UnitListItemLessonCount } from "@/components/TeacherComponents/UnitListItemLessonCount";
import { SpecialistUnit } from "@/node-lib/curriculum-api-2023/queries/specialistUnitListing/specialistUnitListing.schema";
import {
  UnitListingData,
  ReshapedUnitData,
} from "@/node-lib/curriculum-api-2023/queries/unitListing/unitListing.schema";

export type UnitListItemProps = Omit<
  UnitListingData["units"][number][number],
  "unitStudyOrder"
> &
  UnitListProps;

type UnitListProps = {
  hideTopHeading?: boolean;
  hitCount?: number;
  index: number;
  currentPage?: number;
  firstItemRef?: MutableRefObject<HTMLAnchorElement | null> | null;
  isUnitOption?: boolean;
  unitOptions?: ReshapedUnitData[];
  isExemplarUnit?: boolean;
  yearTitle?: string | null;
  onClick: (props: UnitListItemProps | SpecialistListItemProps) => void;
};

export type SpecialistListItemProps = SpecialistUnit & UnitListProps;

/**
 * Contains an title, icon, learning theme, number of lessons and optional Unit Quiz .
 * Links to a lesson-index page
 *
 **/
const UnitListItem: FC<UnitListItemProps | SpecialistListItemProps> = (
  props,
) => {
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
      <OakFlex
        $flexDirection={"column"}
        $justifyContent={"space-between"}
        $width={"100%"}
        $height={"100%"}
        $gap={["all-spacing-2"]}
        $pa="inner-padding-m"
      >
        {!isUnitOption && yearTitle && !isExemplarUnit && (
          <OakSpan
            $font={"heading-light-7"}
            $color={"grey60"}
            $mv="space-between-none"
          >
            {yearTitle}
          </OakSpan>
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

        <OakFlex $flexDirection={["column", "row"]}>
          <UnitListItemLessonCount
            expired={expired}
            expiredLessonCount={expiredLessonCount}
            lessonCount={lessonCount}
          />
        </OakFlex>
      </OakFlex>
    </ListItemCard>
  );
};

export default UnitListItem;
