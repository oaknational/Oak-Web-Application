import React, { FC } from "react";
import {
  OakLI,
  OakUL,
  OakFlex,
  OakUnitsContainer,
} from "@oaknational/oak-components";

import UnitListItem, {
  UnitListItemProps,
  SpecialistListItemProps,
} from "@/components/TeacherComponents/UnitListItem/UnitListItem";
import Box from "@/components/SharedComponents/Box";
import Pagination, {
  PaginationProps,
} from "@/components/SharedComponents/Pagination";
import UnitListOptionalityCard from "@/components/TeacherComponents/UnitListOptionalityCard";
import { UnitOption } from "@/components/TeacherComponents/UnitListOptionalityCard/UnitListOptionalityCard";
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

type PageSize = { pageSize: number };
type CurrentPageItemsProps = Omit<UnitListItemProps, "index" | "onClick">[];

export type UnitListProps = (UnitListingData | SpecialistUnitListingData) & {
  currentPageItems: CurrentPageItemsProps[] | SpecialistUnit[][];
  paginationProps: PaginationProps & PageSize;
  onClick: (props: UnitListItemProps | SpecialistListItemProps) => void;
};

const isCurrentPageItems = (
  u: CurrentPageItemsProps[] | SpecialistUnit[][],
): u is CurrentPageItemsProps[] => {
  return (u[0] as CurrentPageItemsProps)[0]?.keyStageSlug !== undefined;
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

const UnitList: FC<UnitListProps> = (props) => {
  const { units, paginationProps, currentPageItems, onClick, subjectSlug } =
    props;
  const { currentPage, pageSize, firstItemRef } = paginationProps;

  const indexOfFirstLegacyUnit = units
    .map((u) => isSlugLegacy(u[0]!.programmeSlug))
    .indexOf(true);

  const newAndLegacyUnitsOnPage =
    currentPageItems.some((item) => isSlugLegacy(item[0]!.programmeSlug)) &&
    currentPageItems.some((item) => !isSlugLegacy(item[0]!.programmeSlug));

  const getUnitCards = (
    pageItems: CurrentPageItemsProps[] | SpecialistUnit[][],
  ) =>
    pageItems.map((item, index) => {
      const baseIndex = index + pageSize * (currentPage - 1);

      let calculatedIndex = baseIndex;

      if (subjectSlug === "maths") {
        const isItemLegacy = isSlugLegacy(item[0]!.programmeSlug);

        if (isItemLegacy) {
          if (newAndLegacyUnitsOnPage) {
            calculatedIndex = index;
          } else {
            calculatedIndex = baseIndex - indexOfFirstLegacyUnit;
          }
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

  // TODO: handle specialist pages properly, as we are only handling maths currently
  const phaseSlug = isUnitListData(props) ? props.phase : undefined;
  const examBoardSlug = isUnitListData(props) ? props.examBoardSlug : undefined;
  const keystageSlug = isUnitListData(props) ? props.keyStageSlug : undefined;

  const newPageItems = isCurrentPageItems(currentPageItems)
    ? currentPageItems.filter((item) => !isSlugLegacy(item[0]!.programmeSlug))
    : [];
  const legacyPageItems = isCurrentPageItems(currentPageItems)
    ? currentPageItems.filter((item) => isSlugLegacy(item[0]!.programmeSlug))
    : [];

  const NewUnits = () =>
    newPageItems.length && phaseSlug ? (
      <OakUnitsContainer
        isLegacy={false}
        subject="maths"
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
    legacyPageItems.length && keystageSlug && phaseSlug ? (
      <OakUnitsContainer
        isLegacy={true}
        subject="maths"
        phase={phaseSlug}
        curriculumHref={resolveOakHref({
          page: "curriculum-previous-downloads",
          query: {
            subject: subjectSlug,
            keystage: keystageSlug,
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
        subjectSlug === "maths" ? (
          <OakFlex $flexDirection="column" $gap="space-between-xxl">
            <NewUnits />
            <LegacyUnits />
          </OakFlex>
        ) : (
          <OakUL aria-label="A list of units" $reset>
            {...getUnitCards(currentPageItems)}
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
