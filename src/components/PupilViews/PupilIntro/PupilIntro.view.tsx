import {
  OakFlex,
  OakHeading,
  OakSecondaryButton,
} from "@oak-academy/oak-components";

import { useLessonEngineContext } from "@/components/PupilComponents/LessonEngineProvider";

export const PupilViewsIntro = () => {
  const { completeSection } = useLessonEngineContext();
  return (
    <OakFlex
      $flexDirection={"column"}
      $alignItems={"start"}
      $pa={"inner-padding-xl"}
      $gap={"space-between-s"}
    >
      <OakHeading tag="h1">Intro</OakHeading>
      <OakSecondaryButton
        onClick={() => {
          completeSection("intro");
        }}
      >
        Complete Section
      </OakSecondaryButton>
    </OakFlex>
  );
};
