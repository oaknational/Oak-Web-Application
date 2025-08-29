import {
  OakGrid,
  OakGridArea,
  OakHeading,
  OakP,
} from "@oaknational/oak-components";
import { PortableTextBlock, PortableTextComponents } from "@portabletext/react";

import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";

export const campaignTextStyles: PortableTextComponents = {
  block: {
    heading1: (props) => {
      return (
        <OakHeading $font={["heading-5", "heading-5", "heading-2"]} tag="h2">
          {props.children}
        </OakHeading>
      );
    },
    heading2: (props) => {
      return (
        <OakHeading $font={["heading-5", "heading-4", "heading-3"]} tag="h2">
          {props.children}
        </OakHeading>
      );
    },
    heading3: (props) => {
      return (
        <OakHeading
          $font={["heading-light-7", "heading-light-6", "heading-light-5"]}
          tag="h3"
        >
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
        $mb={["space-between-m", "space-between-l"]}
      >
        <PortableTextWithDefaults
          value={heading}
          components={campaignTextStyles}
        />
      </OakGridArea>
      <OakGridArea $colSpan={[12, 8, 8]} $colStart={[1, 3, 3]}>
        <PortableTextWithDefaults
          value={body}
          components={campaignTextStyles}
        />
      </OakGridArea>
    </OakGrid>
  );
};
