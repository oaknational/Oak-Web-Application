import React from "react";

import Flex from "../Flex";
import { Heading, P } from "../Typography";

export type CommonMisconceptionsAndResponses = {
  commonMisconceptions: CommonMisconception[] | null | undefined;
};

export type CommonMisconception = {
  misconception: string | null;
  response: string | null;
};

const CommonMisconceptions = ({
  commonMisconceptions,
}: CommonMisconceptionsAndResponses) => {
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
        Common misconceptions
      </Heading>
      {commonMisconceptions?.map(
        (commonMisconception: CommonMisconception, i: number) => {
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

export default CommonMisconceptions;
