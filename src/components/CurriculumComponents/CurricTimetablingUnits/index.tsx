"use client";
import {
  OakBox,
  OakFlex,
  OakHeading,
  OakInformativeModal,
  OakMaxWidth,
  OakSecondaryButton,
} from "@oaknational/oak-components";
import { ThemeProvider } from "styled-components";
import { useMemo, useState } from "react";

import { CurricTimetableHeader } from "../CurricTimetableHeader";
import CurricTimetablingFilters from "../CurricTimetablingFilters";

import { useTimetableParams } from "@/utils/curriculum/timetabling";
import { CurriculumFilters, Unit } from "@/utils/curriculum/types";
import oakTheme from "@/styles/theme";
import {
  fetchSubjectPhasePickerData,
  formatCurriculumUnitsData,
} from "@/pages-helpers/curriculum/docx/tab-helpers";
import { CurriculumSelectionSlugs } from "@/utils/curriculum/slugs";

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
            <OakFlex $width={"all-spacing-21"} $flexDirection={"column"}>
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
              <ul>
                {data.year &&
                  unitData.yearData[data.year]?.units.map((unit, unitIndex) => {
                    return (
                      <li key={`${unit.slug}-${unitIndex}`}>
                        <div>📦 {unit.title}</div>
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
            </OakFlex>
          </OakFlex>
        </OakMaxWidth>
      </ThemeProvider>
    </>
  );
};
