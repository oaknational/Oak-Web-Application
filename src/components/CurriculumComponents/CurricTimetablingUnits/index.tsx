"use client";
import {
  OakBox,
  OakFlex,
  OakHeading,
  OakInformativeModal,
  OakInlineBanner,
  OakMaxWidth,
  OakSecondaryButton,
} from "@oaknational/oak-components";
import styled, { ThemeProvider } from "styled-components";
import { useMemo, useState } from "react";

import { CurricTimetableHeader } from "../CurricTimetableHeader";
import { CurricTermCard } from "../CurricTermCard";
import CurricUnitCard from "../CurricUnitCard";
import { CurricTimetablingYearCard } from "../CurricTimetablingYearCard";
import CurricTimetablingFilters from "../CurricTimetablingFilters";

import { useTimetableParams } from "@/utils/curriculum/timetabling";
import { CurriculumFilters, Unit } from "@/utils/curriculum/types";
import oakTheme from "@/styles/theme";
import {
  fetchSubjectPhasePickerData,
  formatCurriculumUnitsData,
} from "@/pages-helpers/curriculum/docx/tab-helpers";
import { CurriculumSelectionSlugs } from "@/utils/curriculum/slugs";

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
};
export const CurricTimetablingUnits = ({
  units,
  slugs,
}: CurricTimetablingUnitsProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [data] = useTimetableParams();
  const isDebugMode = data.mode === "debug";
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

  const onEditDetails = () => {
    setModalOpen(true);
  };

  const onCopyLink = () => {
    const urlToCopy = window.location.href;
    navigator.clipboard.writeText(urlToCopy);
  };

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
                {data.year && (
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
                            weeksCovered={12}
                            numberOfWeeks={14}
                          >
                            <UnitList role="list">
                              {unitData.yearData[data.year]?.units.map(
                                (unit, unitIndex) => {
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
                                },
                              )}
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
                        {data.year &&
                          unitData.yearData[data.year]?.units.map(
                            (unit, unitIndex) => {
                              return (
                                <li key={`${unit.slug}-${unitIndex}`}>
                                  <div>📦 {unit.title}</div>
                                  <ul>
                                    {unit.lessons?.map(
                                      (lesson, lessonIndex) => {
                                        return (
                                          <li
                                            key={`${lesson.slug}-${lessonIndex}`}
                                          >
                                            📜 {lesson.title}
                                          </li>
                                        );
                                      },
                                    )}
                                  </ul>
                                </li>
                              );
                            },
                          )}
                      </ul>
                    )}
                  </>
                )}
              </OakBox>
            </OakFlex>
          </OakFlex>
        </OakMaxWidth>
      </ThemeProvider>
    </>
  );
};
