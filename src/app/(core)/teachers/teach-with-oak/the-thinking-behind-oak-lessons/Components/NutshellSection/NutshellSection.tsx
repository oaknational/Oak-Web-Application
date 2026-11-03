import { OakFlex, OakHeading, OakP } from "@oaknational/oak-components";

import {
  SectionContent,
  SectionContentList,
} from "../SectionContentList/SectionContentList";

type NutshellSectionProps = Readonly<{
  id: string;
  heading: string;
  intro: string;
  content: SectionContent;
}>;

export function NutshellSection({
  id,
  heading,
  intro,
  content,
}: NutshellSectionProps) {
  return (
    <OakFlex
      as="section"
      aria-labelledby={id}
      $flexDirection={"column"}
      $gap={"spacing-32"}
    >
      <OakHeading
        $font={["heading-5", "heading-4", "heading-4"]}
        tag="h2"
        id={id}
      >
        {heading}
      </OakHeading>
      <OakP>{intro}</OakP>
      <SectionContentList content={content} />
    </OakFlex>
  );
}
