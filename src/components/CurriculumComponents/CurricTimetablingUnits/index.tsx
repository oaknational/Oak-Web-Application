"use client";
import {
  OakBox,
  OakFlex,
  OakHeading,
  OakInformativeModal,
  OakInlineBanner,
  OakLink,
  OakMaxWidth,
  OakSecondaryButton,
} from "@oaknational/oak-components";
import styled, { ThemeProvider } from "styled-components";
import { useMemo, useState } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";

import { CurricTimetableHeader } from "../CurricTimetableHeader";
import { CurricTermCard } from "../CurricTermCard";
import CurricUnitCard from "../CurricUnitCard";
import { CurricTimetablingYearCard } from "../CurricTimetablingYearCard";
import CurricTimetablingFilters from "../CurricTimetablingFilters";
import CurricUnitModal from "../CurricUnitModal";
import CurricUnitModalContent from "../CurricUnitModalContent/CurricUnitModalContent";
import CurricModalErrorContent from "../CurricModalErrorContent/CurricModalErrorContent";

import { useTimetableParams } from "@/utils/curriculum/timetabling";
import { CurriculumFilters, Unit } from "@/utils/curriculum/types";
import oakTheme from "@/styles/theme";
import {
  fetchSubjectPhasePickerData,
  formatCurriculumUnitsData,
} from "@/pages-helpers/curriculum/docx/tab-helpers";
import { CurriculumSelectionSlugs } from "@/utils/curriculum/slugs";
import { findUnitOrOptionBySlug } from "@/utils/curriculum/units";

const UnitList = styled("ol")`
  margin: 0;
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
`;

const UnitListItem = styled("li")`
  margin: 0;
  liststyle: none;
  padding: 0;
  display: flex;
  width: 240px;
  flex-grow: 1;
  position: relative;
`;

function getDefaultName(
  data: ReturnType<typeof useTimetableParams>[0],
  units: Unit[],
) {
  if (data.name && data.name !== "") {
    return data.name;
  }
  return `Your ${units[0]?.subject ?? ""} timetable`;
}

type CurricTimetablingUnitsProps = {
  slugs: CurriculumSelectionSlugs;
  units: Unit[];
  curriculumPhaseOptions:
    | ReturnType<typeof fetchSubjectPhasePickerData>
    | Awaited<ReturnType<typeof fetchSubjectPhasePickerData>>;
  selectedUnitSlug?: string;
};
export const CurricTimetablingUnits = ({
  units,
  slugs,
  selectedUnitSlug,
}: CurricTimetablingUnitsProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [data] = useTimetableParams();
  const isDebugMode = data.mode === "debug";
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState<CurriculumFilters>(() => {
    return {
      years: [data.year ?? "1"],
      childSubjects: [],
      subjectCategories: [],
      tiers: [],
      threads: [],
      pathways: [],
    };
  });

  const unitDataPre = useMemo(
    () => formatCurriculumUnitsData({ units }),
    [units],
  );

  const unitData = useMemo(() => {
    return {
      ...unitDataPre,
      yearOptions:
        data.year && unitDataPre.yearOptions.includes(data.year)
          ? [data.year]
          : [],
    };
  }, [data, unitDataPre]);

  // Find the unit data for the selected unit slug
  const { unit: selectedUnit, unitOption: selectedUnitOption } =
    findUnitOrOptionBySlug(unitData.yearData, selectedUnitSlug);

  const displayUnitModal = !!selectedUnitSlug;

  // Build the base path - should always end with /units
  let basePath = pathname || "";

  if (basePath.includes("/units/")) {
    // If we're on a unit detail page, strip the unit slug
    basePath = basePath.split("/units/")[0] + "/units";
  }

  const handleCloseModal = () => {
    const searchParamsStr = searchParams?.toString() ?? "";
    const href = `${basePath}${!searchParamsStr ? "" : `?${searchParamsStr}`}`;
    router.replace(href);
  };

  const handleNavigateToUnit = (unitSlug: string) => {
    const searchParamsStr = searchParams?.toString() ?? "";
    const href = `${basePath}/${unitSlug}${!searchParamsStr ? "" : `?${searchParamsStr}`}`;
    router.replace(href);
  };

  const onEditDetails = () => {
    setModalOpen(true);
  };

  const onCopyLink = () => {
    const urlToCopy = window.location.href;
    navigator.clipboard.writeText(urlToCopy);
  };

  const unitsForYear = data.year
    ? unitData.yearData[data.year]?.units
    : undefined;

  const totalNumberOfLessons =
    unitsForYear?.reduce(
      (total, unit) => total + (unit.lessons?.length ?? 0),
      0,
    ) ?? 0;

  return (
    <>
      {/* TODO: <ThemeProvider/> shouldn't be required, work down the tree and remove old components */}
      <ThemeProvider theme={oakTheme}>
        <OakFlex $flexDirection={"column"} $pa={"inner-padding-xl5"}>
          <CurricTimetableHeader
            titleSlot={getDefaultName(data, units)}
            illustrationSlug={"magic-carpet"}
            additionalSlot={
              <OakFlex $maxWidth={"all-spacing-20"} $gap={"all-spacing-4"}>
                <OakSecondaryButton
                  iconName="copy"
                  isTrailingIcon={true}
                  onClick={onEditDetails}
                >
                  Edit details
                </OakSecondaryButton>
                <OakSecondaryButton
                  iconName="edit"
                  isTrailingIcon={true}
                  onClick={onCopyLink}
                >
                  Copy link
                </OakSecondaryButton>
              </OakFlex>
            }
          />
        </OakFlex>

        <OakInformativeModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          closeOnBackgroundClick={true}
        >
          <OakBox data-testid="edit-details-modal">Edit details modal</OakBox>
        </OakInformativeModal>

        <OakMaxWidth $ph={"inner-padding-xl5"}>
          <OakFlex $flexDirection={"row"}>
            <OakFlex
              $minWidth={"all-spacing-21"}
              $maxWidth={"100%"}
              $flexDirection={"column"}
            >
              <CurricTimetablingFilters
                filters={filters}
                onChangeFilters={setFilters}
                slugs={slugs}
                data={unitData}
              />

              <OakHeading tag="h2">Debug</OakHeading>
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </OakFlex>

            <OakFlex $flexGrow={1}>
              <OakBox>
                {unitsForYear && (
                  <>
                    {!isDebugMode && (
                      <CurricTimetablingYearCard
                        yearTitle={`Year ${data.year}`}
                      >
                        <OakFlex
                          $flexDirection={"column"}
                          $gap={"all-spacing-6"}
                        >
                          <OakInlineBanner
                            message={
                              <OakBox>
                                <strong>You’re 1 lesson short:</strong> the Year
                                1 curriculum has more lessons than your schedule
                                allows. Use the orange (!) markers to help you
                                decide which lesson to skip.
                              </OakBox>
                            }
                            isOpen={true}
                          />
                          <CurricTermCard
                            title="Autumn Term"
                            coveredNumberOfLessons={totalNumberOfLessons}
                            totalNumberOfLessons={totalNumberOfLessons}
                          >
                            <UnitList role="list">
                              {unitsForYear.map((unit, unitIndex) => {
                                return (
                                  <UnitListItem
                                    key={`${unit.slug}-${unitIndex}`}
                                  >
                                    <CurricUnitCard
                                      key={unitIndex}
                                      unit={unit}
                                      index={unitIndex}
                                      isHighlighted={false}
                                      href={""}
                                    />
                                  </UnitListItem>
                                );
                              })}
                              {/* Empty tiles for correct flex wrapping */}
                              {Array(3)
                                .fill(true)
                                .map((item, index) => {
                                  return (
                                    <OakFlex
                                      key={`unit-list-item-${item}-${index}`}
                                      $width={"all-spacing-19"}
                                      $flexGrow={1}
                                      $position={"relative"}
                                    />
                                  );
                                })}
                            </UnitList>
                          </CurricTermCard>
                        </OakFlex>
                      </CurricTimetablingYearCard>
                    )}

                    {isDebugMode && (
                      <ul>
                        {unitsForYear.map((unit, unitIndex) => {
                          const searchParamsStr =
                            searchParams?.toString() ?? "";
                          const unitUrl = `${basePath}/${unit.slug}${!searchParamsStr ? "" : `?${searchParamsStr}`}`;

                          return (
                            <li key={`${unit.slug}-${unitIndex}`}>
                              <OakLink href={unitUrl} color="black">
                                📦 {unit.title}
                              </OakLink>
                              <ul>
                                {unit.lessons?.map((lesson, lessonIndex) => {
                                  return (
                                    <li key={`${lesson.slug}-${lessonIndex}`}>
                                      📜 {lesson.title}
                                    </li>
                                  );
                                })}
                              </ul>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </>
                )}
              </OakBox>
            </OakFlex>
          </OakFlex>
        </OakMaxWidth>

        {/* Unit Modal */}
        <CurricUnitModal
          open={displayUnitModal}
          onClose={handleCloseModal}
          unitData={selectedUnit}
          unitOptionData={selectedUnitOption}
          filters={filters}
          disableFooter={Boolean(selectedUnitSlug && !selectedUnit)}
        >
          {selectedUnit && (
            <CurricUnitModalContent
              basePath={basePath}
              unitData={selectedUnit}
              unitOptionData={selectedUnitOption}
              yearData={unitData.yearData}
              selectedThread={null}
              onNavigateToUnit={handleNavigateToUnit}
            />
          )}
          {selectedUnitSlug && !selectedUnit && (
            <OakBox
              $pv={[
                "inner-padding-xl",
                "inner-padding-xl5",
                "inner-padding-xl5",
              ]}
              $ph={[
                "inner-padding-xl",
                "inner-padding-xl6",
                "inner-padding-xl6",
              ]}
            >
              <CurricModalErrorContent
                statusCode="404"
                message="This unit does not exist."
                additional="Close the modal to browse available units."
              />
            </OakBox>
          )}
        </CurricUnitModal>
      </ThemeProvider>
    </>
  );
};
