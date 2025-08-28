import { OakGrid, OakGridArea } from "@oaknational/oak-components";
import { PortableTextBlock } from "@portabletext/react";

import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";
import { textStyles } from "@/pages/campaigns/[campaignSlug]";

export const CampaignPageIntro = ({
  heading,
  body,
}: {
  heading: PortableTextBlock[];
  body: PortableTextBlock[];
}) => {
  return (
    <OakGrid
      $mt={["space-between-xxl", "space-between-xxl", "space-between-xxxl"]}
      $maxWidth={["unset", "all-spacing-24"]}
    >
      <OakGridArea
        $colSpan={[12, 10, 10]}
        $colStart={[1, 2, 2]}
        $mb={["space-between-m", "space-between-l"]}
      >
        <PortableTextWithDefaults value={heading} components={textStyles} />
      </OakGridArea>
      <OakGridArea $colSpan={[12, 8, 8]} $colStart={[1, 3, 3]}>
        <PortableTextWithDefaults value={body} components={textStyles} />
      </OakGridArea>
    </OakGrid>
  );
};
