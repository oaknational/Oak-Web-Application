import {
  OakFlex,
  OakHeading,
  OakSecondaryButton,
} from "@oak-academy/oak-components";

import { useLessonEngineContext } from "@/components/PupilComponents/LessonEngineProvider";

export const PupilViewsReview = () => {
  const { updateCurrentSection } = useLessonEngineContext();
  return (
    <OakFlex
      $flexDirection={"column"}
      $alignItems={"start"}
      $pa={"inner-padding-xl"}
      $gap={"space-between-s"}
    >
      <OakHeading tag="h1">Review</OakHeading>
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
