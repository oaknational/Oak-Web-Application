import { OakGrid, OakGridArea, OakBox } from "@oaknational/oak-components";

export function OaksImpactCaseStudyContent() {
  return (
    <OakGrid $cg="spacing-16">
      <OakGridArea $rowStart={1} $colSpan={[12, 3, 2]}>
        <OakBox $ba="border-solid-m" $pa="spacing-24" $borderColor="icon-error">
          TODO: Menu
        </OakBox>
      </OakGridArea>
      <OakGridArea $colStart={[1, 4, 3]} $colSpan={[12, 9, 8]}>
        <OakBox $ba="border-solid-m" $pa="spacing-24" $borderColor="icon-error">
          TODO: Main
        </OakBox>
      </OakGridArea>
    </OakGrid>
  );
}
