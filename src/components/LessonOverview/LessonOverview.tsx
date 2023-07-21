import React from "react";

import Flex from "../Flex";
import Heading from "../Typography";
import UL from "../Typography/UL";
import LI from "../Typography/LI";

type KeyLearningPoint = {
  keyLearningPoint: string | null;
};

type KeyLearningPoints = { keyLearningPoints: KeyLearningPoint[] };

const LessonOverview = ({ keyLearningPoints }: KeyLearningPoints) => {
  const filteredKeyLearningPoints = keyLearningPoints.filter(
    (keyLearningPoint) =>
      keyLearningPoint.keyLearningPoint !== null &&
      keyLearningPoint.keyLearningPoint !== ""
  );

  return (
    <Flex $justifyContent={"center"} $width={"100%"}>
      <Flex
        $pa={[10, 24]}
        $flexDirection={"column"}
        $mt={22}
        $position={"relative"}
        $justifyContent={"center"}
        $width={["100%", 840]}
      >
        <Heading $font={"heading-5"} $mb={[16, 24]} data-testid={"heading"}>
          Key learning points
        </Heading>
        <UL $pl={24}>
          {filteredKeyLearningPoints.map(
            (keyLearningPoint: KeyLearningPoint, i: number) => {
              if (!keyLearningPoint) {
                return null;
              } else {
                return (
                  <LI
                    key={`core-content-string-${i}`}
                    $font={["list-item-2", "list-item-1"]}
                  >
                    {keyLearningPoint.keyLearningPoint}
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

export default LessonOverview;
