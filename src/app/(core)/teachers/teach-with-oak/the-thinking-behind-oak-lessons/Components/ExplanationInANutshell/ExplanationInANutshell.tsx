import { OakHeading, OakP } from "@oaknational/oak-components";

export function ExplanationInANutshell() {
  return (
    <>
      <OakHeading
        $font={["heading-5", "heading-4", "heading-4"]}
        tag="h2"
        $mb={"spacing-32"}
        id="explanation"
      >
        Explanation in a nutshell
      </OakHeading>
      <OakP $mb={"spacing-32"}>
        Explore Oak's approach to explanation and the thinking behind our
        design, with questions to help you reflect on what this means for your
        classroom.
      </OakP>
      <OakHeading
        $font={["heading-7", "heading-6", "heading-6"]}
        tag="h3"
        $mb={"spacing-16"}
      >
        What?
      </OakHeading>
      <OakP $mb={"spacing-32"}>
        Explanation is a pedagogical strategy that presents new knowledge to
        pupils and connects it with what they already know.
      </OakP>
      <OakHeading
        $font={["heading-7", "heading-6", "heading-6"]}
        tag="h3"
        $mb={"spacing-16"}
      >
        Why?
      </OakHeading>
      <OakP $mb={"spacing-32"}>
        Effective explanation makes new knowledge clear and manageable, helping
        pupils build secure understanding.
      </OakP>
    </>
  );
}
