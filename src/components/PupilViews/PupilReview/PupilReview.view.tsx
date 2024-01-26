import {
  OakBox,
  OakFlex,
  OakHeading,
  OakLI,
  OakSecondaryButton,
} from "@oaknational/oak-components";

import {
  lessonSections,
  useLessonEngineContext,
} from "@/components/PupilComponents/LessonEngineProvider";

export const PupilViewsReview = () => {
  const { updateCurrentSection, sectionResults } = useLessonEngineContext();
  return (
    <OakFlex
      $flexDirection={"column"}
      $alignItems={"start"}
      $pa={"inner-padding-xl"}
      $gap={"space-between-s"}
    >
      <OakHeading tag="h1">Review</OakHeading>
      {lessonSections
        .filter((s) => s !== "overview" && s !== "review")
        .map((s) => (
          <OakLI
            key={s}
            $mv="space-between-ssx"
            $pa={"inner-padding-s"}
            $ba="border-solid-s"
          >
            <OakFlex
              $gap={"space-between-ssx"}
              $justifyContent={"space-between"}
            >
              {s}
              <OakBox $width={"all-spacing-5"}>
                "✅"
                {sectionResults[s] &&
                  `${sectionResults[s]?.grade}/${sectionResults[s]?.numQuestions}`}
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
