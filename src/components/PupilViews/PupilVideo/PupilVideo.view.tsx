import {
  OakFlex,
  OakHeading,
  OakSecondaryButton,
} from "@oak-academy/oak-components";

import { useLessonEngineContext } from "@/components/PupilComponents/LessonEngineProvider";

export const PupilViewsVideo = () => {
  const { completeSection } = useLessonEngineContext();
  return (
    <OakFlex
      $flexDirection={"column"}
      $alignItems={"start"}
      $pa={"inner-padding-xl"}
      $gap={"space-between-s"}
    >
      <OakHeading tag="h1">Video</OakHeading>
      <OakSecondaryButton
        onClick={() => {
          completeSection("video");
        }}
      >
        Complete Section
      </OakSecondaryButton>
    </OakFlex>
  );
};
