import React, { FC, MouseEvent } from "react";
import { NextRouter, useRouter } from "next/router";
import { useFeatureFlagEnabled } from "posthog-js/react";
import {
  OakFlex,
  OakUnitsContainer,
  OakUnitListItem,
  OakUnitListOptionalityItem,
  OakPagination,
  OakAnchorTarget,
  OakBox,
  OakInlineBanner,
} from "@oaknational/oak-components";

import { UnitOption } from "../UnitListOptionalityCard/UnitListOptionalityCard";
import { getSubjectPhaseSlug } from "../helpers/getSubjectPhaseSlug";

import { getPageItems, getProgrammeFactors } from "./helpers";
import { UnitListLegacyBanner } from "./UnitListLegacyBanner";

import {
  UnitListItemProps,
  SpecialistListItemProps,
} from "@/components/TeacherComponents/UnitListItem/UnitListItem";
import {
  SpecialistUnit,
  SpecialistUnitListingData,
} from "@/node-lib/curriculum-api-2023/queries/specialistUnitListing/specialistUnitListing.schema";
import { UnitListingData } from "@/node-lib/curriculum-api-2023/queries/unitListing/unitListing.schema";
import { resolveOakHref } from "@/common-lib/urls";
import isSlugLegacy from "@/utils/slugModifiers/isSlugLegacy";
import { PaginationProps } from "@/components/SharedComponents/Pagination/usePagination";
import { convertSubjectToSlug } from "@/components/TeacherComponents/helpers/convertSubjectToSlug";
import { useGetEducatorData } from "@/node-lib/educator-api/helpers/useGetEducatorData";
import { useSaveUnits } from "@/node-lib/educator-api/helpers/saveUnits/useSaveUnits";

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
  filteredUnits?: UnitListingData["units"];
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

export const getUnitLessonCount = (unit: {
  lessonCount: number | null;
  expiredLessonCount: number | null;
  unpublishedLessonCount: number;
}) => {
  const { lessonCount, expiredLessonCount, unpublishedLessonCount } = unit;
  let countHeader = "";
  if (lessonCount) {
    if (unpublishedLessonCount || expiredLessonCount) {
      if (expiredLessonCount && expiredLessonCount > lessonCount) {
        countHeader = `0 lessons`;
      } else {
        // unpublished lessons arent included in the lessonCount, but expired lessons are
        const totalLessonCount = lessonCount + unpublishedLessonCount;
        countHeader = `${lessonCount - (expiredLessonCount ?? 0)}/${totalLessonCount} lesson${totalLessonCount > 1 ? "s" : ""}`;
      }
    } else {
      countHeader = `${lessonCount} lesson${lessonCount > 1 ? "s" : ""}`;
    }
  }

  return countHeader;
};

const UnitList: FC<UnitListProps> = (props) => {
  const {
    units,
    paginationProps,
    currentPageItems,
    onClick,
    subjectSlug,
    subjectParent,
    filteredUnits,
    subjectTitle,
  } = props;

  const linkSubject = subjectParent
    ? convertSubjectToSlug(subjectParent)
    : subjectSlug;
  const { currentPage, pageSize, firstItemRef, paginationRoute, onPageChange } =
    paginationProps;
  const router = useRouter();
  const category = router.query["category"]?.toString();
  const modifiedCategory =
    category === "reading-writing-oracy"
      ? "Reading, writing & oracy"
      : category;
  const newPageItems = getPageItems({
    pageItems: currentPageItems,
    pickLegacyItems: false,
    isSwimming: false,
  });
  const legacyPageItems = getPageItems({
    pageItems: currentPageItems,
    pickLegacyItems: true,
    isSwimming: false,
  });
  const swimmingPageItems = getPageItems({
    pageItems: currentPageItems,
    pickLegacyItems: false,
    isSwimming: true,
  });

  const { phaseSlug, keyStageSlug, examBoardSlug } = getProgrammeFactors(props);
  const indexOfFirstLegacyUnit = units
    .map((u) => isSlugLegacy(u[0]!.programmeSlug))
    .indexOf(true);

  // Saving
  const isSaveEnabled = useFeatureFlagEnabled("teacher-save-units");

  // TODO: error handling
  const { data: savedUnits } = useGetEducatorData(
    `/api/educator-api/getSavedUnits/${props.programmeSlug}`,
  );
  const { onSaveToggle, isUnitSaved } = useSaveUnits(
    savedUnits,
    props.programmeSlug,
  );

  const hasNewAndLegacyUnits: boolean =
    !!phaseSlug && !!newPageItems.length && !!legacyPageItems.length;

  const getUnitCards = (
    pageItems: CurrentPageItemsProps[] | SpecialistUnit[][],
  ) => {
    const newAndLegacyUnitsOnPage =
      currentPageItems.some((item) => isSlugLegacy(item[0]!.programmeSlug)) &&
      currentPageItems.some((item) => !isSlugLegacy(item[0]!.programmeSlug));

    // get the type of the page items

    return pageItems.map((item, index) => {
      const baseIndex = index + pageSize * (currentPage - 1);
      let calculatedIndex = baseIndex;
      const isItemLegacy = isSlugLegacy(item[0]!.programmeSlug);

      const isSpecialistUnit = !isUnitListData(props);

      if (isItemLegacy) {
        if (newAndLegacyUnitsOnPage) {
          calculatedIndex = index;
        } else if (filteredUnits) {
          const legacyUnits = filteredUnits?.filter((unit) =>
            isSlugLegacy(unit[0]!.programmeSlug),
          );

          // this is a TS hack to get around typescript not following the logic of isSpecialistUnit
          const castItem = item as Omit<
            UnitListItemProps,
            "index" | "onClick"
          >[];

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
          onSave={isSaveEnabled ? onSaveToggle : undefined}
          getIsSaved={isUnitSaved}
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

          return (
            <OakUnitListItem
              {...props}
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
              onSave={
                isSaveEnabled ? () => onSaveToggle(unitOption.slug) : undefined
              }
              isSaved={isUnitSaved(unitOption.slug)}
            />
          );
        })
      );
    });
  };

  //TODO: Temporary measure until curriculum downloads are ready for RSHE
  const hideNewCurriculumDownloadButton =
    subjectSlug === "rshe-pshe" || subjectSlug === "financial-education";

  const NewUnits = ({ category }: { category?: string }) =>
    newPageItems.length && phaseSlug ? (
      <OakUnitsContainer
        isLegacy={false}
        subject={category ?? subjectTitle}
        phase={phaseSlug}
        curriculumHref={
          hideNewCurriculumDownloadButton
            ? null
            : resolveOakHref({
                page: "curriculum-units",
                subjectPhaseSlug: getSubjectPhaseSlug({
                  subject: linkSubject,
                  phaseSlug,
                  examBoardSlug,
                }),
              })
        }
        showHeader={paginationProps.currentPage === 1}
        unitCards={getUnitCards(newPageItems)}
      />
    ) : null;

  const LegacyUnits = () =>
    legacyPageItems.length && keyStageSlug && phaseSlug ? (
      <OakUnitsContainer
        isLegacy={true}
        banner={
          <UnitListLegacyBanner
            userType={"teacher"}
            hasNewUnits={hasNewAndLegacyUnits}
            allLegacyUnits={legacyPageItems}
            onButtonClick={() => onPageChange(1)}
          />
        }
        subject={subjectSlug}
        phase={phaseSlug}
        curriculumHref={resolveOakHref({
          page: "curriculum-previous-downloads",
          query: {
            subject: linkSubject,
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

  const SwimmingUnits = () => {
    if (swimmingPageItems.length && keyStageSlug && phaseSlug) {
      const title = `${swimmingPageItems[0]?.[0]?.groupUnitsAs} units (all years)`;
      return (
        <OakUnitsContainer
          isLegacy={false}
          subject={""}
          phase={phaseSlug}
          curriculumHref={resolveOakHref({
            page: "curriculum-previous-downloads",
            query: {
              subject: linkSubject,
              keystage: keyStageSlug,
            },
          })}
          showHeader={
            swimmingPageItems.length || indexOfFirstLegacyUnit % pageSize === 0
              ? true
              : false
          }
          unitCards={getUnitCards(swimmingPageItems)}
          isCustomUnit={true}
          customHeadingText={title}
          banner={
            <OakInlineBanner
              isOpen={true}
              message={
                "Swimming and water safety lessons should be selected based on the ability and experience of your pupils."
              }
              type="neutral"
              $width={"100%"}
            />
          }
        />
      );
    } else return null;
  };

  return (
    <OakFlex $flexDirection="column">
      <OakAnchorTarget id="unit-list" />
      {currentPageItems.length ? (
        isUnitListData(props) ? (
          <OakFlex $flexDirection="column" $gap="space-between-xxl">
            <SwimmingUnits />
            <NewUnits category={modifiedCategory} />
            <LegacyUnits />
          </OakFlex>
        ) : (
          <OakUnitsContainer
            isLegacy={true}
            banner={
              <UnitListLegacyBanner
                userType={"teacher"}
                hasNewUnits={hasNewAndLegacyUnits}
                allLegacyUnits={legacyPageItems}
                onButtonClick={() => onPageChange(1)}
              />
            }
            subject={subjectSlug}
            phase={"Specialist and therapies"}
            curriculumHref={`${resolveOakHref({
              page: "curriculum-previous-downloads",
              query: {
                subject: subjectSlug,
              },
            })}#Specialist`}
            showHeader={true}
            unitCards={getUnitCards(currentPageItems)}
          />
        )
      ) : null}
      {units.length > 5 ? (
        <OakBox
          $width="100%"
          $mt={["space-between-none", "auto"]}
          $pb={["inner-padding-xl2", "inner-padding-xl4"]}
          $pt={["inner-padding-xl4", "inner-padding-xl2"]}
        >
          <OakPagination
            {...paginationProps}
            pageName={props.subjectTitle}
            paginationHref={paginationRoute}
          />
        </OakBox>
      ) : (
        <OakBox $pb="inner-padding-xl2" />
      )}
    </OakFlex>
  );
};

export default UnitList;
