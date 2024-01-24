import React from "react";

import { Heading, P } from "@/components/SharedComponents/Typography";
import Flex from "@/components/SharedComponents/Flex";

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
    <Flex
      $flexDirection={"column"}
      $position={"relative"}
      $justifyContent={"center"}
    >
      <Heading $font={"heading-5"} $mb={24} data-testid={"heading"} tag="h3">
        Common misconception
      </Heading>
      {commonMisconceptions?.map(
        (commonMisconception: LessonOverviewCommonMisconception, i: number) => {
          return (
            <Flex $flexDirection={"column"} key={`common-misconception-${i}`}>
              <P $mb={24} $font={"body-1-bold"}>
                {commonMisconception.misconception}
              </P>
              <P $font={"body-1"}>{commonMisconception.response}</P>
            </Flex>
          );
        },
      )}
    </Flex>
  );
};

export default LessonOverviewCommonMisconceptions;
