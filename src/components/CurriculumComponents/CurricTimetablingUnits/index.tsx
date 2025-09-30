"use client";
import { OakBox, OakFlex, OakMaxWidth } from "@oaknational/oak-components";

import { CurricTimetableHeader } from "../CurricTimetableHeader";
import { CurricShowSteps } from "../CurricShowSteps";

import { useTimetableParams } from "@/utils/curriculum/timetabling";
import { parseSubjectPhaseSlug } from "@/utils/curriculum/slugs";

type CurricTimetablingUnitsProps = { subjectPhaseSlug: string };
export const CurricTimetablingUnits = ({
  subjectPhaseSlug,
}: CurricTimetablingUnitsProps) => {
  const [data] = useTimetableParams();
  const { subjectSlug } = parseSubjectPhaseSlug(subjectPhaseSlug)!;

  return (
    <>
      <OakFlex $flexDirection={"column"} $pa={"inner-padding-xl5"}>
        <CurricTimetableHeader
          titleSlot={`Year ${data.year} ${subjectSlug}`}
          illustrationSlug={"magic-carpet"}
          additionalSlot={
            <OakBox $maxWidth={"all-spacing-20"}>
              <CurricShowSteps numberOfSteps={2} currentStepIndex={1} />
            </OakBox>
          }
        />
      </OakFlex>

      <OakMaxWidth $ph={"inner-padding-xl5"}>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </OakMaxWidth>
    </>
  );
};
