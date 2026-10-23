import { OakFlex, OakHeading, OakP } from "@oaknational/oak-components";

export function ShortReadsHeading() {
  return (
    <OakFlex $flexDirection={"column"}>
      <OakHeading
        $font={["heading-4", "heading-3", "heading-2"]}
        tag="h1"
        $mb={"spacing-48"}
      >
        The thinking behind Oak lessons
      </OakHeading>
      <OakP $mb={"spacing-48"}>
        See how our lessons are designed to support learning - and make the most
        of them in your classroom.
      </OakP>
    </OakFlex>
  );
}
