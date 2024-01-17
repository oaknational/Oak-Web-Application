import {
  OakBox,
  OakFlex,
  OakHeading,
  OakLI,
  OakSecondaryButton,
} from "@oak-academy/oak-components";

import { useLessonEngineContext } from "@/components/PupilComponents/LessonEngineProvider";

export const PupilViewsReview = () => {
  const { updateCurrentSection, completedSections, sectionResults } =
    useLessonEngineContext();
  return (
    <OakFlex
      $flexDirection={"column"}
      $alignItems={"start"}
      $pa={"inner-padding-xl"}
      $gap={"space-between-s"}
    >
      <OakHeading tag="h1">Review</OakHeading>
      {completedSections.map((s) => (
        <OakLI
          key={s}
          $mv="space-between-ssx"
          $pa={"inner-padding-s"}
          $ba="border-solid-s"
        >
          <OakFlex $gap={"space-between-ssx"} $justifyContent={"space-between"}>
            {s}
            <OakBox $width={"all-spacing-5"}>
              "✅"
              {sectionResults[s] &&
                `${sectionResults[s]?.grade}/${sectionResults[s]?.maxScore}`}
            </OakBox>
          </OakFlex>
        </OakLI>
      ))}
      <OakSecondaryButton
        onClick={() => {
          updateCurrentSection("overview");
        }}
      >
        Back
      </OakSecondaryButton>
    </OakFlex>
  );
};
