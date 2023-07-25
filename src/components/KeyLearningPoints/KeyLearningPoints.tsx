import React from "react";

import Flex from "../Flex";
import Heading from "../Typography";
import UL from "../Typography/UL";
import P from "../Typography/P";
import LI from "../Typography/LI";
import { KeyLearningPoint } from "../LessonDetails/LessonDetails";

type LessonKeyLearningPoints = { keyLearningPoints: KeyLearningPoint[] };

const KeyLearningPoints = ({ keyLearningPoints }: LessonKeyLearningPoints) => {
  const filteredKeyLearningPoints = keyLearningPoints.filter(
    (keyLearningPoint) =>
      keyLearningPoint.keyLearningPoint !== null &&
      keyLearningPoint.keyLearningPoint !== ""
  );

  return (
    <Flex $justifyContent={"center"} $width={"100%"}>
      <Flex
        $flexDirection={"column"}
        $position={"relative"}
        $justifyContent={"center"}
        $width={["100%", 840]}
      >
        <Heading
          $font={["heading-6", "heading-5"]}
          $mb={24}
          data-testid={"heading"}
        >
          Key learning points
        </Heading>
        <UL $reset>
          {filteredKeyLearningPoints.map(
            (keyLearningPoint: KeyLearningPoint, i: number) => {
              const listNumber = i + 1;
              if (!keyLearningPoint) {
                return null;
              } else {
                return (
                  <LI
                    key={`key-learning-point-${i}`}
                    $font={["list-item-2", "list-item-1"]}
                  >
                    <Flex $mb={12}>
                      <P $mr={4}>{listNumber}. </P>
                      <P>{`${keyLearningPoint.keyLearningPoint}`}</P>
                    </Flex>
                  </LI>
                );
              }
            }
          )}
        </UL>
      </Flex>
    </Flex>
  );
};

export default KeyLearningPoints;
