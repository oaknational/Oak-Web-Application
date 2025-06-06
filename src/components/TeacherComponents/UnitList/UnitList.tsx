import React, { FC, useState } from "react";
import { useRouter } from "next/router";
import { useFeatureFlagEnabled } from "posthog-js/react";
import {
  OakFlex,
  OakUnitsContainer,
  OakPagination,
  OakAnchorTarget,
  OakBox,
  OakInlineBanner,
} from "@oaknational/oak-components";

import { getSubjectPhaseSlug } from "../helpers/getSubjectPhaseSlug";

import { getPageItems, getProgrammeFactors } from "./helpers";
import { UnitListLegacyBanner } from "./UnitListLegacyBanner";
import { getUnitCards, GetUnitCards } from "./getUnitCards";

import {
  UnitListItemProps,
  SpecialistListItemProps,
} from "@/components/TeacherComponents/UnitListItem/UnitListItem";
import SavingSignedOutModal from "@/components/TeacherComponents/SavingSignedOutModal/SavingSignedOutModal";
import {
  SpecialistUnit,
  SpecialistUnitListingData,
} from "@/node-lib/curriculum-api-2023/queries/specialistUnitListing/specialistUnitListing.schema";
import { UnitListingData } from "@/node-lib/curriculum-api-2023/queries/unitListing/unitListing.schema";
import { resolveOakHref } from "@/common-lib/urls";
import isSlugLegacy from "@/utils/slugModifiers/isSlugLegacy";
import { PaginationProps } from "@/components/SharedComponents/Pagination/usePagination";
import { convertSubjectToSlug } from "@/components/TeacherComponents/helpers/convertSubjectToSlug";
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

const isUnitListData = (
  u: UnitListingData | SpecialistUnitListingData,
): u is UnitListingData => {
  return (u as UnitListingData).keyStageSlug !== undefined;
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

const NewUnits = ({
  category,
  pageItems,
  phaseSlug,
  subjectTitle,
  hideNewCurriculumDownloadButton,
  currentPage,
  linkSubject,
  examBoardSlug,
  unitCards,
}: {
  category?: string;
  pageItems: CurrentPageItemsProps[];
  phaseSlug?: string;
  subjectTitle: string;
  hideNewCurriculumDownloadButton?: boolean;
  currentPage?: number;
  examBoardSlug?: string | null;
  linkSubject: string;
  unitCards: GetUnitCards;
}) =>
  pageItems.length && phaseSlug ? (
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
      showHeader={currentPage === 1}
      unitCards={unitCards}
    />
  ) : null;

const LegacyUnits = ({
  pageItems,
  phaseSlug,
  linkSubject,
  keyStageSlug,
  unitCards,
  hasNewAndLegacyUnits,
  onPageChange,
  subjectSlug,
  indexOfFirstLegacyUnit,
  pageSize,
  newItemsLength,
}: {
  pageItems: CurrentPageItemsProps[];
  phaseSlug?: string;
  linkSubject: string;
  unitCards: GetUnitCards;
  keyStageSlug?: string | null;
  hasNewAndLegacyUnits: boolean;
  onPageChange: (page: number) => void;
  subjectSlug: string;
  indexOfFirstLegacyUnit: number;
  pageSize: number;
  newItemsLength: number;
}) => {
  return pageItems.length && keyStageSlug && phaseSlug ? (
    <OakUnitsContainer
      isLegacy={true}
      banner={
        <UnitListLegacyBanner
          userType={"teacher"}
          hasNewUnits={hasNewAndLegacyUnits}
          allLegacyUnits={pageItems}
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
        newItemsLength || indexOfFirstLegacyUnit % pageSize === 0 ? true : false
      }
      unitCards={unitCards}
    />
  ) : null;
};

const SwimmingUnits = ({
  pageItems,
  phaseSlug,
  linkSubject,
  unitCards,
  keyStageSlug,
  indexOfFirstLegacyUnit,
  pageSize,
}: {
  pageItems: CurrentPageItemsProps[];
  phaseSlug?: string;
  linkSubject: string;
  unitCards: GetUnitCards;
  keyStageSlug?: string | null;
  indexOfFirstLegacyUnit: number;
  pageSize: number;
}) => {
  if (pageItems.length && keyStageSlug && phaseSlug) {
    const title = `${pageItems[0]?.[0]?.groupUnitsAs} units (all years)`;
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
          pageItems.length || indexOfFirstLegacyUnit % pageSize === 0
            ? true
            : false
        }
        unitCards={unitCards}
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

  const { phaseSlug, keyStageSlug, examBoardSlug, keyStageTitle } =
    getProgrammeFactors(props);

  const indexOfFirstLegacyUnit = units
    .map((u) => isSlugLegacy(u[0]!.programmeSlug))
    .indexOf(true);

  // Saving
  const isSaveEnabled = useFeatureFlagEnabled("teacher-save-units");
  const { onSaveToggle, isUnitSaved, showSignIn, setShowSignIn } = useSaveUnits(
    props.programmeSlug,
    {
      keyStageTitle,
      keyStageSlug,
      subjectTitle: props.subjectTitle,
      subjectSlug: props.subjectSlug,
      savedFrom: "unit_listing_save_button",
    },
  );

  const hasNewAndLegacyUnits: boolean =
    !!phaseSlug && !!newPageItems.length && !!legacyPageItems.length;

  //TODO: Temporary measure until curriculum downloads are ready for RSHE
  const hideNewCurriculumDownloadButton =
    subjectSlug === "rshe-pshe" || subjectSlug === "financial-education";

  const [saveButtonElementId, setSaveButtonElementId] = useState<
    string | undefined
  >();
  const unitCardProps = {
    currentPageItems,
    pageSize,
    currentPage,
    isSaveEnabled,
    isSpecialistUnit: !isUnitListData(props),
    filteredUnits,
    indexOfFirstLegacyUnit,
    firstItemRef: firstItemRef ?? undefined,
    onClick,
    isUnitSaved,
    onSaveToggle,
    setElementId: setSaveButtonElementId,
  };

  return (
    <OakFlex $flexDirection="column">
      <OakAnchorTarget id="unit-list" />
      {showSignIn && (
        <SavingSignedOutModal
          isOpen={showSignIn}
          onClose={() => setShowSignIn(false)}
          returnToElementId={saveButtonElementId}
        />
      )}
      {currentPageItems.length ? (
        isUnitListData(props) ? (
          <OakFlex $flexDirection="column" $gap="space-between-xxl">
            <SwimmingUnits
              pageItems={swimmingPageItems}
              phaseSlug={phaseSlug}
              unitCards={getUnitCards({
                pageItems: swimmingPageItems,
                ...unitCardProps,
              })}
              linkSubject={linkSubject}
              keyStageSlug={keyStageSlug}
              indexOfFirstLegacyUnit={indexOfFirstLegacyUnit}
              pageSize={pageSize}
            />
            <NewUnits
              category={modifiedCategory}
              pageItems={newPageItems}
              phaseSlug={phaseSlug}
              subjectTitle={subjectTitle}
              hideNewCurriculumDownloadButton={hideNewCurriculumDownloadButton}
              currentPage={currentPage}
              unitCards={getUnitCards({
                pageItems: newPageItems,
                ...unitCardProps,
              })}
              linkSubject={linkSubject}
              examBoardSlug={examBoardSlug}
            />
            <LegacyUnits
              pageItems={legacyPageItems}
              phaseSlug={phaseSlug}
              unitCards={getUnitCards({
                pageItems: legacyPageItems,
                ...unitCardProps,
              })}
              linkSubject={linkSubject}
              keyStageSlug={keyStageSlug}
              hasNewAndLegacyUnits={hasNewAndLegacyUnits}
              onPageChange={onPageChange}
              subjectSlug={subjectSlug}
              indexOfFirstLegacyUnit={indexOfFirstLegacyUnit}
              pageSize={pageSize}
              newItemsLength={newPageItems.length}
            />
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
            unitCards={getUnitCards({
              pageItems: currentPageItems,
              ...unitCardProps,
            })}
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
