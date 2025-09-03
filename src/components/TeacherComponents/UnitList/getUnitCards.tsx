import {
  OakUnitListOptionalityItem,
  OakUnitListItem,
} from "@oaknational/oak-components";
import router, { NextRouter } from "next/router";
import { MouseEvent, MutableRefObject } from "react";

import {
  UnitListItemProps,
  SpecialistListItemProps,
} from "../UnitListItem/UnitListItem";

import { isUnitOption } from "./helpers";
import { CurrentPageItemsProps, getUnitLessonCount } from "./UnitList";

import isSlugLegacy from "@/utils/slugModifiers/isSlugLegacy";
import { UnitListingData } from "@/node-lib/curriculum-api-2023/queries/unitListing/unitListing.schema";
import { SpecialistUnit } from "@/node-lib/curriculum-api-2023/queries/specialistUnitListing/specialistUnitListing.schema";
import { resolveOakHref } from "@/common-lib/urls";

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
    const lessonCount = getUnitLessonCount({
      lessonCount: unitOption.lessonCount,
      expiredLessonCount: unitOption.expiredLessonCount,
      unpublishedLessonCount: unitOption.unpublishedLessonCount,
    });

    return {
      title: unitOption.title,
      slug: unitOption.slug,
      href: resolveOakHref({
        page: "lesson-index",
        unitSlug: unitOption.slug,
        programmeSlug: unitOption.programmeSlug,
      }),
      lessonCount,
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

export const areNewAndLegacyUnitsOnPage = (
  currentPageItems: CurrentPageItemsProps[] | SpecialistUnit[][],
) =>
  currentPageItems.some((item) => isSlugLegacy(item[0]!.programmeSlug)) &&
  currentPageItems.some((item) => !isSlugLegacy(item[0]!.programmeSlug));

export const getUnitCards = ({
  pageItems,
  pageSize,
  currentPage,
  isSpecialistUnit,
  filteredUnits,
  indexOfFirstLegacyUnit,
  firstItemRef,
  onClick,
  isUnitSaved,
  isUnitSaving,
  onSaveToggle,
  setElementId,
  newAndLegacyUnitsOnPage,
}: {
  pageItems: CurrentPageItemsProps[] | SpecialistUnit[][];
  pageSize: number;
  currentPage: number;
  isSpecialistUnit: boolean;
  filteredUnits: UnitListingData["units"] | undefined;
  indexOfFirstLegacyUnit: number;
  firstItemRef?: MutableRefObject<HTMLAnchorElement | null>;
  onClick: (props: UnitListItemProps | SpecialistListItemProps) => void;
  isUnitSaved: (slug: string) => boolean;
  isUnitSaving?: (slug: string) => boolean;
  onSaveToggle: (slug: string) => void;
  setElementId?: (elementId: string) => void;
  newAndLegacyUnitsOnPage: boolean;
}) => {
  return pageItems.map((item, index) => {
    const baseIndex = index + pageSize * (currentPage - 1);
    let calculatedIndex = baseIndex;
    const isItemLegacy = isSlugLegacy(item[0]!.programmeSlug);

    const showSave = !isSpecialistUnit && !isItemLegacy;

    if (isItemLegacy) {
      if (newAndLegacyUnitsOnPage) {
        calculatedIndex = index;
      } else if (filteredUnits) {
        const legacyUnits = filteredUnits?.filter((unit) =>
          isSlugLegacy(unit[0]!.programmeSlug),
        );

        // this is a TS hack to get around typescript not following the logic of isSpecialistUnit
        const castItem = item as Omit<UnitListItemProps, "index" | "onClick">[];

        const findIndex = legacyUnits?.findIndex(
          (unit) =>
            unit[0]?.slug === item[0]?.slug &&
            (isSpecialistUnit || unit[0]?.year === castItem[0]?.year),
        );
        calculatedIndex = findIndex;
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
        yearTitle={item[0]?.yearTitle}
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
        onSave={showSave ? onSaveToggle : undefined}
        getIsSaved={isUnitSaved}
        getIsSaving={isUnitSaving}
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
        const unitLessonCount = getUnitLessonCount({
          lessonCount: unitOption.lessonCount,
          expiredLessonCount: unitOption.expiredLessonCount,
          unpublishedLessonCount: unitOption.unpublishedLessonCount,
        });

        const saveButtonId = `save-button-${unitOption.slug}`;

        return (
          <OakUnitListItem
            {...unitOption}
            lessonCount={unitLessonCount}
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
            unavailable={unitOption.expired || undefined}
            href={resolveOakHref({
              page: `${
                isSpecialistUnit ? "specialist-lesson-index" : "lesson-index"
              }`,
              unitSlug: unitOption.slug,
              programmeSlug: unitOption.programmeSlug,
            })}
            saveButtonId={saveButtonId}
            onSave={
              showSave
                ? () => {
                    if (setElementId) {
                      setElementId(saveButtonId);
                    }
                    onSaveToggle(unitOption.slug);
                  }
                : undefined
            }
            isSaved={isUnitSaved(unitOption.slug)}
            isSaving={isUnitSaving?.(unitOption.slug)}
          />
        );
      })
    );
  });
};
