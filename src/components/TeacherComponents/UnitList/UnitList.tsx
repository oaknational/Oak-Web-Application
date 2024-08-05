import React, { FC, MouseEvent } from "react";
import {
  OakFlex,
  OakUL,
  OakUnitsContainer,
  OakUnitListItem,
  OakUnitListOptionalityItem,
} from "@oaknational/oak-components";
import { NextRouter, useRouter } from "next/router";

import { UnitOption } from "../UnitListOptionalityCard/UnitListOptionalityCard";

import { getPageItems, getProgrammeFactors } from "./helpers";

import {
  UnitListItemProps,
  SpecialistListItemProps,
} from "@/components/TeacherComponents/UnitListItem/UnitListItem";
import Box from "@/components/SharedComponents/Box";
import Pagination, {
  PaginationProps,
} from "@/components/SharedComponents/Pagination";
import {
  SpecialistUnit,
  SpecialistUnitListingData,
} from "@/node-lib/curriculum-api-2023/queries/specialistUnitListing/specialistUnitListing.schema";
import { UnitListingData } from "@/node-lib/curriculum-api-2023/queries/unitListing/unitListing.schema";
import { resolveOakHref } from "@/common-lib/urls";
import isSlugLegacy from "@/utils/slugModifiers/isSlugLegacy";

export type Tier = {
  title: string;
  slug: string;
  unitCount: number | null;
};

export type PageSize = { pageSize: number };
export type CurrentPageItemsProps = Omit<
  UnitListItemProps,
  "index" | "onClick"
>[];

export type UnitListProps = (UnitListingData | SpecialistUnitListingData) & {
  currentPageItems: CurrentPageItemsProps[] | SpecialistUnit[][];
  paginationProps: PaginationProps & PageSize;
  onClick: (props: UnitListItemProps | SpecialistListItemProps) => void;
};

const isUnitOption = (
  x: Omit<UnitListItemProps, "onClick" | "index">[] | SpecialistUnit[],
): x is UnitOption[] => {
  if (x[0]) {
    return "keyStageTitle" in x[0];
  } else {
    return false;
  }
};

const isUnitListData = (
  u: UnitListingData | SpecialistUnitListingData,
): u is UnitListingData => {
  return (u as UnitListingData).keyStageSlug !== undefined;
};

const getOptionalityUnits = (
  unit: CurrentPageItemsProps | SpecialistUnit[],
  onClick: (props: UnitListItemProps | SpecialistListItemProps) => void,
  router: NextRouter,
) => {
  return unit.map((unitOption) => {
    const handleClick = (e: MouseEvent<HTMLElement>) => {
      // Tracking data was not being sent to avo before the page reload, so we prevent the default and use router to navigate to the page after the onClick
      const target = e.currentTarget;
      onClick({
        ...unitOption,
        index: 0,
        onClick,
      });
      if (target instanceof HTMLAnchorElement) {
        router.push(target.href);
      }
    };
    return {
      title: unitOption.title,
      href: resolveOakHref({
        page: "lesson-index",
        unitSlug: unitOption.slug,
        programmeSlug: unitOption.programmeSlug,
      }),
      lessonCount: unitOption.lessonCount || 0,
      onClick: handleClick,
    };
  });
};

const isUnitFirstItemRef = (
  // first item ref is used to focus on the first list item when the pagination is used
  programmeSlug: string,
  newAndLegacyUnitsOnPage: boolean,
  index: number,
) => {
  if (index === 0 && !newAndLegacyUnitsOnPage) {
    return true;
  } else if (
    index === 0 &&
    newAndLegacyUnitsOnPage &&
    !isSlugLegacy(programmeSlug)
  ) {
    return true;
  }
};

const UnitList: FC<UnitListProps> = (props) => {
  const { units, paginationProps, currentPageItems, onClick, subjectSlug } =
    props;
  const { currentPage, pageSize, firstItemRef } = paginationProps;
  const router = useRouter();

  const newPageItems = getPageItems(currentPageItems, false);
  const legacyPageItems = getPageItems(currentPageItems, true);

  const { phaseSlug, keyStageSlug, examBoardSlug } = getProgrammeFactors(props);
  const indexOfFirstLegacyUnit = units
    .map((u) => isSlugLegacy(u[0]!.programmeSlug))
    .indexOf(true);

  const getUnitCards = (
    pageItems: CurrentPageItemsProps[] | SpecialistUnit[][],
  ) => {
    const newAndLegacyUnitsOnPage =
      currentPageItems.some((item) => isSlugLegacy(item[0]!.programmeSlug)) &&
      currentPageItems.some((item) => !isSlugLegacy(item[0]!.programmeSlug));

    return pageItems.map((item, index) => {
      const baseIndex = index + pageSize * (currentPage - 1);
      let calculatedIndex = baseIndex;
      const isItemLegacy = isSlugLegacy(item[0]!.programmeSlug);

      if (isItemLegacy) {
        if (newAndLegacyUnitsOnPage) {
          calculatedIndex = index;
        } else {
          calculatedIndex = baseIndex - indexOfFirstLegacyUnit;
        }
      }

      return item.length > 1 && isUnitOption(item) ? (
        <OakUnitListOptionalityItem
          index={calculatedIndex + 1}
          key={`UnitList-UnitListItem-UnitListOption-${item[0]!.slug}`}
          data-testid="unit-optionality-card"
          nullTitle={item[0]!.nullTitle}
          firstItemRef={
            isUnitFirstItemRef(
              item[0]!.programmeSlug,
              newAndLegacyUnitsOnPage,
              index,
            )
              ? firstItemRef
              : null
          }
          optionalityUnits={getOptionalityUnits(item, onClick, router)}
        />
      ) : (
        item.map((unitOption) => {
          const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
            // Tracking data was not being sent to avo, so we prevent the default and use router to navigate to the page after the onClick
            e.preventDefault();
            onClick({
              ...unitOption,
              index: 0,
              onClick,
            });
            router.push(e.currentTarget.href);
          };
          return (
            <OakUnitListItem
              {...props}
              {...unitOption}
              firstItemRef={
                isUnitFirstItemRef(
                  unitOption.programmeSlug,
                  newAndLegacyUnitsOnPage,
                  index,
                )
                  ? firstItemRef
                  : null
              }
              data-testid="unit-list-item"
              key={`UnitList-UnitListItem-UnitListOption-${unitOption.slug}`}
              index={calculatedIndex + 1}
              isLegacy={isSlugLegacy(unitOption.programmeSlug)}
              onClick={handleClick}
              href={resolveOakHref({
                page: "lesson-index",
                unitSlug: unitOption.slug,
                programmeSlug: unitOption.programmeSlug,
              })}
            />
          );
        })
      );
    });
  };

  const NewUnits = () =>
    newPageItems.length && phaseSlug ? (
      <OakUnitsContainer
        isLegacy={false}
        subject={subjectSlug}
        phase={phaseSlug}
        curriculumHref={resolveOakHref({
          page: "curriculum-units",
          subjectPhaseSlug: `${subjectSlug}-${phaseSlug}${
            examBoardSlug ? `-${examBoardSlug}` : ""
          }`,
        })}
        showHeader={paginationProps.currentPage === 1}
        unitCards={getUnitCards(newPageItems)}
      />
    ) : null;

  const LegacyUnits = () =>
    legacyPageItems.length && keyStageSlug && phaseSlug ? (
      <OakUnitsContainer
        isLegacy={true}
        subject={subjectSlug}
        phase={phaseSlug}
        curriculumHref={resolveOakHref({
          page: "curriculum-previous-downloads",
          query: {
            subject: subjectSlug,
            keystage: keyStageSlug,
          },
        })}
        showHeader={
          newPageItems.length || indexOfFirstLegacyUnit % pageSize === 0
            ? true
            : false
        }
        unitCards={getUnitCards(legacyPageItems)}
      />
    ) : null;

  return (
    <OakFlex $flexDirection="column">
      {currentPageItems.length ? (
        isUnitListData(props) ? (
          <OakFlex $flexDirection="column" $gap="space-between-xxl">
            <NewUnits />
            <LegacyUnits />
          </OakFlex>
        ) : (
          <OakUL aria-label="A list of units" $reset>
            {getUnitCards(currentPageItems)}
          </OakUL>
        )
      ) : null}
      {units.length > 5 ? (
        <Box $width="100%" $mt={[0, "auto"]} $pb={[30, 44]} $pt={[46, 36]}>
          <Pagination
            pageName={props.subjectTitle}
            {...paginationProps}
            firstItemRef={firstItemRef}
          />
        </Box>
      ) : (
        <Box $pb={32} />
      )}
    </OakFlex>
  );
};

export default UnitList;
