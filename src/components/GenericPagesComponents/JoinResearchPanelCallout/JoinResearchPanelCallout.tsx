import { OakFlex, OakHeading, OakLI, OakP } from "@oaknational/oak-components";
import { PortableTextComponents } from "@portabletext/react";

import { NewGutterMaxWidth } from "../NewGutterMaxWidth";
import AboutUsInfoCard from "../AboutUsInfoCard";

import { JoinResearchPanelPageBlock } from "@/common-lib/cms-types";
import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";

const calloutPortableTextComponents: PortableTextComponents = {
  block: {
    normal: (props) => (
      <OakP $font="heading-light-6" $mt="spacing-16">
        {props.children}
      </OakP>
    ),
  },
};

export type JoinResearchPanelCalloutProps = Omit<
  JoinResearchPanelPageBlock<"JoinResearchPanelPageCallout">,
  "__typename"
>;

export default function JoinResearchPanelCallout({
  title,
  items,
}: Readonly<JoinResearchPanelCalloutProps>) {
  return (
    <OakFlex
      $background="bg-decorative3-very-subdued"
      $pv={["spacing-56", "spacing-80"]}
    >
      <NewGutterMaxWidth>
        <OakFlex $flexDirection={"column"} $gap="spacing-32">
          <OakHeading tag="h2" $font={["heading-4", "heading-3"]}>
            {title}
          </OakHeading>
          <OakFlex
            as="ul"
            $pa="spacing-0"
            $gap="spacing-16"
            $flexDirection={["column", "row"]}
          >
            {items.map((item) => (
              <OakLI
                $listStyle={"none"}
                $display={"flex"}
                key={item.bodyRaw[0]?._key}
              >
                <AboutUsInfoCard
                  icon={item.icon}
                  background="bg-primary"
                  iconHeight="spacing-80"
                  iconWidth="spacing-80"
                  borderColor="border-decorative3"
                >
                  <PortableTextWithDefaults
                    components={calloutPortableTextComponents}
                    value={item.bodyRaw}
                  />
                </AboutUsInfoCard>
              </OakLI>
            ))}
          </OakFlex>
        </OakFlex>
      </NewGutterMaxWidth>
    </OakFlex>
  );
}
