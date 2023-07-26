import React from "react";

import Flex from "../Flex";
import Heading from "../Typography";
import OL from "../Typography/OL";
import LI from "../Typography/LI";

export type KeyLearningPoint = {
  keyLearningPoint: string | null;
};

type LessonKeyLearningPoints = { keyLearningPoints: KeyLearningPoint[] };

const KeyLearningPoints = ({ keyLearningPoints }: LessonKeyLearningPoints) => {
  const filteredKeyLearningPoints = keyLearningPoints.filter(
    (keyLearningPoint) =>
      keyLearningPoint.keyLearningPoint !== null &&
      keyLearningPoint.keyLearningPoint !== ""
  );

  return (
    <Flex $justifyContent={"center"} $width={"100%"} $mb={48}>
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
        <OL $mb={0} $mt={0}>
          {filteredKeyLearningPoints.map(
            (keyLearningPoint: KeyLearningPoint, i: number) => {
              if (!keyLearningPoint) {
                return null;
              } else {
                return (
                  <LI
                    key={`key-learning-point-${i}`}
                    $font={["list-item-2", "list-item-1"]}
                  >
                    {`${keyLearningPoint.keyLearningPoint}`}
                  </LI>
                );
              }
            }
          )}
        </OL>
      </Flex>
    </Flex>
  );
};

export default KeyLearningPoints;
