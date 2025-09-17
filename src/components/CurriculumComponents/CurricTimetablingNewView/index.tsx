"use client";

import { OakFlex, OakPrimaryButton } from "@oaknational/oak-components";

export const CurricTimetablingNewView = () => {
  return (
    <OakFlex>
      <h1>New timetable form</h1>
      <OakPrimaryButton element="a" href="/timetabling/name">
        Next
      </OakPrimaryButton>
    </OakFlex>
  );
};
