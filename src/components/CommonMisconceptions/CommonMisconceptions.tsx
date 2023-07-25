import React from "react";

import Flex from "../Flex";
import Heading, { P } from "../Typography";
import { CommonMisconception } from "../LessonDetails/LessonDetails";

export type CommonMisconceptionsAndResponses = {
  commonMisconceptions: CommonMisconception[] | null | undefined;
};

const CommonMisconceptions = ({
  commonMisconceptions,
}: CommonMisconceptionsAndResponses) => {
  return (
    <Flex $justifyContent={"center"} $width={"100%"} $mt={36} $mb={48}>
      <Flex
        $flexDirection={"column"}
        $position={"relative"}
        $justifyContent={"center"}
        $width={["100%", 840]}
      >
        <Heading $font={"heading-5"} $mb={24} data-testid={"heading"}>
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
          }
        )}
      </Flex>
    </Flex>
  );
};

export default CommonMisconceptions;
