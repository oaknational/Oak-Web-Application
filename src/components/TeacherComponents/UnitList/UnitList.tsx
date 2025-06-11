import React, { FC, useState } from "react";
import { useRouter } from "next/router";
import {
  OakFlex,
  OakUnitsContainer,
  OakPagination,
  OakAnchorTarget,
  OakBox,
  OakInlineBanner,
} from "@oaknational/oak-components";

import SignPostToAila from "../NoSearchResults/SignPostToAila";
import { getSubjectPhaseSlug } from "../helpers/getSubjectPhaseSlug";

import { getPageItems, getProgrammeFactors } from "./helpers";
import { UnitListLegacyBanner } from "./UnitListLegacyBanner";
import { areNewAndLegacyUnitsOnPage, getUnitCards } from "./getUnitCards";

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

  const sharedUnitCardProps = {
    currentPageItems,
    pageSize,
    currentPage,
    isSpecialistUnit: !isUnitListData(props),
    filteredUnits,
    indexOfFirstLegacyUnit,
    firstItemRef: firstItemRef ?? undefined,
    onClick,
    isUnitSaved,
    onSaveToggle,
    setElementId: setSaveButtonElementId,
    newAndLegacyUnitsOnPage: areNewAndLegacyUnitsOnPage(currentPageItems),
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
            {/* Swimming units */}
            {swimmingPageItems.length > 0 && keyStageSlug && phaseSlug && (
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
                  swimmingPageItems.length ||
                  indexOfFirstLegacyUnit % pageSize === 0
                    ? true
                    : false
                }
                unitCards={getUnitCards({
                  pageItems: swimmingPageItems,
                  ...sharedUnitCardProps,
                })}
                isCustomUnit={true}
                customHeadingText={`${swimmingPageItems[0]?.[0]?.groupUnitsAs} units (all years)`}
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
            )}

            {/* New units */}
            {newPageItems.length > 0 && phaseSlug && (
              <OakUnitsContainer
                isLegacy={false}
                subject={modifiedCategory ?? subjectTitle}
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
                unitCards={getUnitCards({
                  pageItems: newPageItems,
                  ...sharedUnitCardProps,
                })}
              />
            )}

            {/* Legacy units */}
            {legacyPageItems.length > 0 && keyStageSlug && phaseSlug && (
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
                unitCards={getUnitCards({
                  pageItems: legacyPageItems,
                  ...sharedUnitCardProps,
                })}
              />
            )}
          </OakFlex>
        ) : (
          // Specialist units
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
              ...sharedUnitCardProps,
            })}
          />
        )
      ) : null}

      {/* Pagination footer */}
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

      <SignPostToAila
        key="aila-sign-post"
        title="Can't find what you need?"
        text="Create a tailor-made lesson plan and resources on any topic with Aila, our free AI-powered lesson assistant. Entirely adaptable to your class and context."
        searchExpression={""}
        keyStage={keyStageSlug}
        subject={subjectSlug}
      />
    </OakFlex>
  );
};

export default UnitList;
