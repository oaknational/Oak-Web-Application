"use client";

import {
  OakFlex,
  OakHeading,
  OakPrimaryButton,
} from "@oaknational/oak-components";

export const CurricTimetablingNewView = () => {
  return (
    <OakFlex>
      <OakHeading tag="h1" $font="heading-2">
        New timetable
      </OakHeading>
      <OakPrimaryButton element="a" href="/timetabling/name">
        Next
      </OakPrimaryButton>
    </OakFlex>
  );
};
