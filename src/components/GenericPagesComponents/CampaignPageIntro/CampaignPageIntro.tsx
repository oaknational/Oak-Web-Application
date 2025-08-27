import {
  OakHeading,
  OakGrid,
  OakGridArea,
  OakP,
} from "@oaknational/oak-components";
import { PortableTextBlock, PortableTextComponents } from "@portabletext/react";

import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";

const textStyles: PortableTextComponents = {
  block: {
    heading1: (props) => {
      return (
        <OakHeading $font={["heading-5", "heading-5", "heading-2"]} tag="h2">
          {props.children}
        </OakHeading>
      );
    },
    heading5: (props) => {
      return (
        <OakHeading
          $font={["heading-6", "heading-6", "heading-5"]}
          tag="h3"
          $mb={"space-between-m"}
        >
          {props.children}
        </OakHeading>
      );
    },
    normal: (props) => {
      return <OakP $font={["body-1", "body-1"]}>{props.children}</OakP>;
    },
  },
};

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
        $mb={"space-between-l"}
      >
        <PortableTextWithDefaults value={heading} components={textStyles} />
      </OakGridArea>
      <OakGridArea $colSpan={[12, 8, 8]} $colStart={[1, 3, 3]}>
        <PortableTextWithDefaults value={body} components={textStyles} />
      </OakGridArea>
    </OakGrid>
  );
};
