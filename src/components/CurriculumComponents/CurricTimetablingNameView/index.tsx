"use client";
import {
  OakBox,
  OakFlex,
  OakPrimaryButton,
  OakMaxWidth,
} from "@oaknational/oak-components";

import { CurricTimetableHeader } from "../CurricTimetableHeader";
import { CurricShowSteps } from "../CurricShowSteps";

export const CurricTimetablingNameView = () => {
  return (
    <>
      <OakFlex $flexDirection={"column"} $pa={"inner-padding-xl5"}>
        <CurricTimetableHeader
          titleSlot={"Year N subject"}
          illustrationSlug={"magic-carpet"}
          additionalSlot={
            <OakBox $maxWidth={"all-spacing-20"}>
              <CurricShowSteps numberOfSteps={2} currentStepIndex={1} />
            </OakBox>
          }
        />
      </OakFlex>

      <OakMaxWidth $ph={"inner-padding-xl5"}>
        <OakFlex
          $flexDirection={"column"}
          $pa={"inner-padding-xl5"}
          $gap={"space-between-l"}
          $maxWidth={"all-spacing-23"}
        >
          <OakFlex
            $flexDirection={"row"}
            $pa={"inner-padding-xl5"}
            $gap={"space-between-l"}
            $maxWidth={"all-spacing-23"}
          >
            <OakPrimaryButton
              element="a"
              href="/timetabling/new"
              pv="inner-padding-m"
              ph="inner-padding-l"
              style={{ height: "auto" }}
            >
              Previous
            </OakPrimaryButton>
            <OakPrimaryButton
              element="a"
              href="/timetabling/units"
              pv="inner-padding-m"
              ph="inner-padding-l"
              style={{ height: "auto" }}
            >
              Next
            </OakPrimaryButton>
          </OakFlex>
        </OakFlex>
      </OakMaxWidth>
    </>
  );
};
