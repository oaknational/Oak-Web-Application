"use client";

import {
  OakBox,
  OakFlex,
  OakP,
  OakPrimaryButton,
} from "@oaknational/oak-components";

import { CurricTimetableHeader } from "../CurricTimetableHeader";
import { CurricShowSteps } from "../CurricShowSteps";

export const CurricTimetablingNewView = () => {
  return (
    <OakFlex $flexDirection={"column"} $pa={"inner-padding-xl5"}>
      <CurricTimetableHeader
        titleSlot={"Subject Year N"}
        illustrationSlug={"magic-carpet"}
        additionalSlot={
          <OakBox $maxWidth={"all-spacing-20"}>
            <CurricShowSteps numberOfSteps={2} currentStepIndex={0} />
          </OakBox>
        }
      />
      <OakP>New timetable</OakP>
      <OakPrimaryButton element="a" href="/timetabling/name">
        Next
      </OakPrimaryButton>
    </OakFlex>
  );
};
