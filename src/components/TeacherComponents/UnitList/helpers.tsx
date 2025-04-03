import { UnitListItemProps } from "../UnitListItem/UnitListItem";
import { UnitOption } from "../UnitListOptionalityCard/UnitListOptionalityCard";

import { CurrentPageItemsProps, UnitListProps } from "./UnitList";

import isSlugLegacy from "@/utils/slugModifiers/isSlugLegacy";
import {
  SpecialistUnit,
  SpecialistUnitListingData,
} from "@/node-lib/curriculum-api-2023/queries/specialistUnitListing/specialistUnitListing.schema";
import { UnitListingData } from "@/node-lib/curriculum-api-2023/queries/unitListing/unitListing.schema";

export const isCurrentPageItems = (
  u: CurrentPageItemsProps[] | SpecialistUnit[][],
): u is CurrentPageItemsProps[] => {
  return (
    u.length > 0 &&
    (u[0] as CurrentPageItemsProps)[0]?.keyStageSlug !== undefined
  );
};

export const isUnitListData = (
  u: UnitListingData | SpecialistUnitListingData,
): u is UnitListingData => {
  return (u as UnitListingData).keyStageSlug !== undefined;
};

export const getPageItems = (
  pageItems: CurrentPageItemsProps[] | SpecialistUnit[][],
  pickLegacyItems: boolean,
) => {
  if (!isCurrentPageItems(pageItems)) {
    return [];
  }
  return pageItems.filter((item) => {
    const isLegacy = isSlugLegacy(item[0]!.programmeSlug);
    return pickLegacyItems ? isLegacy : !isLegacy;
  });
};

export const getProgrammeFactors = (props: UnitListProps) => {
  if (isUnitListData(props)) {
    const { phase, examBoardSlug, keyStageSlug } = props;
    return { phaseSlug: phase, examBoardSlug, keyStageSlug };
  } else {
    return {
      phase: undefined,
      examBoardSlug: undefined,
      keyStageSlug: undefined,
    };
  }
};

export const isUnitOption = (
  x: Omit<UnitListItemProps, "onClick" | "index">[] | SpecialistUnit[],
): x is UnitOption[] => {
  if (x[0]) {
    return "keyStageTitle" in x[0];
  } else {
    return false;
  }
};
