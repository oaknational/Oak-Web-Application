import React from "react";

import { OakHeading, OakP, OakFlex } from "@oaknational/oak-components";

export type LessonOverviewCommonMisconceptionsAndResponses = {
  commonMisconceptions: LessonOverviewCommonMisconception[] | null | undefined;
};

export type LessonOverviewCommonMisconception = {
  misconception: string | null;
  response: string | null;
};

const LessonOverviewCommonMisconceptions = ({
  commonMisconceptions,
}: LessonOverviewCommonMisconceptionsAndResponses) => {
  if (
    commonMisconceptions &&
    !commonMisconceptions[0]?.misconception &&
    !commonMisconceptions[0]?.response
  ) {
    return null;
  }

  return (
    <OakFlex
      $flexDirection={"column"}
      $position={"relative"}
      $justifyContent={"center"}
    >
      <OakHeading
        $font={"heading-5"}
        $mb="space-between-m"
        data-testid={"heading"}
        tag="h3"
      >
        Common misconception
      </OakHeading>
      {commonMisconceptions?.map(
        (commonMisconception: LessonOverviewCommonMisconception, i: number) => {
          return (
            <OakFlex
              $flexDirection={"column"}
              key={`common-misconception-${i}`}
            >
              <OakP $mb="space-between-m" $font={"body-1-bold"}>
                {commonMisconception.misconception}
              </OakP>
              <OakP $font={["body-2", "body-1"]}>
                {commonMisconception.response}
              </OakP>
            </OakFlex>
          );
        },
      )}
    </OakFlex>
  );
};

export default LessonOverviewCommonMisconceptions;
