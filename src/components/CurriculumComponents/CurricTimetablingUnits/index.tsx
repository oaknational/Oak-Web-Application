"use client";
import {
  OakBox,
  OakFlex,
  OakHeading,
  OakMaxWidth,
} from "@oaknational/oak-components";
import { ThemeProvider } from "styled-components";
import { useMemo } from "react";

import { CurricTimetableHeader } from "../CurricTimetableHeader";
import { CurricShowSteps } from "../CurricShowSteps";

import { useTimetableParams } from "@/utils/curriculum/timetabling";
import { parseSubjectPhaseSlug } from "@/utils/curriculum/slugs";
import { Unit } from "@/utils/curriculum/types";
import oakTheme from "@/styles/theme";
import {
  fetchSubjectPhasePickerData,
  formatCurriculumUnitsData,
} from "@/pages-helpers/curriculum/docx/tab-helpers";

type CurricTimetablingUnitsProps = {
  subjectPhaseSlug: string;
  units: Unit[];
  curriculumPhaseOptions: Awaited<
    ReturnType<typeof fetchSubjectPhasePickerData>
  >;
};
export const CurricTimetablingUnits = ({
  subjectPhaseSlug,
  units,
}: CurricTimetablingUnitsProps) => {
  const [data] = useTimetableParams();
  const slugs = parseSubjectPhaseSlug(subjectPhaseSlug)!;

  const unitData = useMemo(() => formatCurriculumUnitsData({ units }), [units]);

  return (
    <>
      {/* TODO: <ThemeProvider/> shouldn't be required, work down the tree and remove old components */}
      <ThemeProvider theme={oakTheme}>
        <OakFlex $flexDirection={"column"} $pa={"inner-padding-xl5"}>
          <CurricTimetableHeader
            titleSlot={`Year ${data.year} ${slugs.subjectSlug}`}
            illustrationSlug={"magic-carpet"}
            additionalSlot={
              <OakBox $maxWidth={"all-spacing-20"}>
                <CurricShowSteps numberOfSteps={2} currentStepIndex={1} />
              </OakBox>
            }
          />
        </OakFlex>

        <OakMaxWidth $ph={"inner-padding-xl5"}>
          <OakFlex $flexDirection={"row"}>
            <OakFlex $width={"all-spacing-21"} $flexDirection={"column"}>
              <OakHeading tag="h2">Filter and highlight</OakHeading>
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
