import { OakGrid, OakGridArea } from "@oaknational/oak-components";
import { PortableTextBlock, PortableTextComponents } from "@portabletext/react";

import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";

export const CampaignPageIntro = ({
  textStyles,
  heading,
  body,
}: {
  heading: PortableTextBlock[];
  body: PortableTextBlock[];
  textStyles?: PortableTextComponents;
}) => {
  return (
    <OakGrid
      $mt={["spacing-72", "spacing-72", "spacing-80"]}
      $maxWidth={["unset", "spacing-1280"]}
    >
      <OakGridArea
        $colSpan={[12, 10, 10]}
        $colStart={[1, 2, 2]}
        $mb={["spacing-24", "spacing-48"]}
      >
        <PortableTextWithDefaults value={heading} components={textStyles} />
      </OakGridArea>
      <OakGridArea $colSpan={[12, 8, 8]} $colStart={[1, 3, 3]}>
        <PortableTextWithDefaults value={body} components={textStyles} />
      </OakGridArea>
    </OakGrid>
  );
};
