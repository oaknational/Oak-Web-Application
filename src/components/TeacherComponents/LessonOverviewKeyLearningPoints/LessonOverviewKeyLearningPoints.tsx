import React from "react";
import { OakOL, OakLI, OakHeading, OakFlex } from "@oaknational/oak-components";

export type LessonOverviewKeyLearningPointProps = {
  keyLearningPoint: string | null;
};

type LessonOverviewKeyLearningPointsProps = {
  keyLearningPoints: LessonOverviewKeyLearningPointProps[];
};

const LessonOverviewKeyLearningPoints = ({
  keyLearningPoints,
}: LessonOverviewKeyLearningPointsProps) => {
  const filteredKeyLearningPoints = keyLearningPoints.filter(
    (keyLearningPoint) =>
      keyLearningPoint.keyLearningPoint !== null &&
      keyLearningPoint.keyLearningPoint !== "",
  );

  return (
    <OakFlex
      $flexDirection={"column"}
      $position={"relative"}
      $justifyContent={"center"}
    >
      <OakHeading
        $font={["heading-6", "heading-5"]}
        $mb="spacing-24"
        data-testid={"heading"}
        tag="h3"
      >
        Key learning points
      </OakHeading>
      <OakOL $mb="spacing-0" $mt="spacing-0">
        {filteredKeyLearningPoints.map(
          (
            keyLearningPoint: LessonOverviewKeyLearningPointProps,
            i: number,
          ) => {
            if (!keyLearningPoint) {
              return null;
            } else {
              return (
                <OakLI
                  key={`key-learning-point-${i}`}
                  $font={["list-item-2", "list-item-1"]}
                >
                  {`${keyLearningPoint.keyLearningPoint}`}
                </OakLI>
              );
            }
          },
        )}
      </OakOL>
    </OakFlex>
  );
};

export default LessonOverviewKeyLearningPoints;
