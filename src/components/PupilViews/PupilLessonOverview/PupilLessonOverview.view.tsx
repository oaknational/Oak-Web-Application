import {
  OakBox,
  OakFlex,
  OakHeading,
  OakLI,
  OakPrimaryButton,
  OakSecondaryButton,
  OakUL,
} from "@oaknational/oak-components";

import {
  lessonSections,
  useLessonEngineContext,
} from "@/components/PupilComponents/LessonEngineProvider";

export const PupilViewsLessonOverview = () => {
  const {
    completedSections,
    sectionResults,
    updateCurrentSection,
    proceedToNextSection,
  } = useLessonEngineContext();

  return (
    <OakFlex
      $pa={"inner-padding-l"}
      $flexDirection={"column"}
      $alignItems={"start"}
      $gap={"space-between-s"}
    >
      <OakHeading tag="h1">Overview</OakHeading>
      <OakUL>
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
                <OakSecondaryButton
                  onClick={() => {
                    updateCurrentSection(s);
                  }}
                >
                  {s}
                </OakSecondaryButton>
                <OakBox $width={"all-spacing-5"}>
                  {completedSections.includes(s) && "✅"}
                  {sectionResults[s] &&
                    `${sectionResults[s]?.grade}/${sectionResults[s]?.numQuestions}`}
                </OakBox>
              </OakFlex>
            </OakLI>
          ))}
      </OakUL>
      <OakPrimaryButton onClick={proceedToNextSection}>
        Proceed to next section
      </OakPrimaryButton>
    </OakFlex>
  );
};
