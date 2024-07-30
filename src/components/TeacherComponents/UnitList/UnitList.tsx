import React, { FC } from "react";
import {
  OakLI,
  OakFlex,
  OakUnitsContainer,
  OakUL,
} from "@oaknational/oak-components";

import {
  getPageItems,
  getProgrammeFactors,
  isUnitListData,
  isUnitOption,
} from "./helpers";

import UnitListItem, {
  UnitListItemProps,
  SpecialistListItemProps,
} from "@/components/TeacherComponents/UnitListItem/UnitListItem";
import Box from "@/components/SharedComponents/Box";
import Pagination, {
  PaginationProps,
} from "@/components/SharedComponents/Pagination";
import UnitListOptionalityCard from "@/components/TeacherComponents/UnitListOptionalityCard";
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

const UnitList: FC<UnitListProps> = (props) => {
  const { units, paginationProps, currentPageItems, onClick, subjectSlug } =
    props;
  const { currentPage, pageSize, firstItemRef } = paginationProps;

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

      return (
        <OakLI
          key={`UnitList-UnitListItem-${item[0]?.slug}`}
          data-testid="unit-list-item"
          $width="100%"
        >
          {item.length > 1 && isUnitOption(item) ? (
            <UnitListOptionalityCard
              unitOptions={item}
              index={calculatedIndex}
              onClick={onClick}
            />
          ) : (
            <OakFlex>
              {item.map((unitOption) => {
                return (
                  <UnitListItem
                    {...props}
                    {...unitOption}
                    key={`UnitList-UnitListItem-UnitListOption-${unitOption.slug}`}
                    hideTopHeading
                    index={calculatedIndex}
                    firstItemRef={index === 0 ? firstItemRef : null}
                    onClick={onClick}
                  />
                );
              })}
            </OakFlex>
          )}
        </OakLI>
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
