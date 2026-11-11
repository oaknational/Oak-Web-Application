import { OakFlex, OakHeading, OakP } from "@oaknational/oak-components";
import { PortableTextComponents } from "@portabletext/react";
import styled from "styled-components";

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

const StyledLi = styled.li`
  display: flex;
  flex: 1 1 0;
  list-style: none;
`;

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
            $flexDirection={["column", "row"]}
            $pa={"spacing-0"}
            $ma={"spacing-0"}
            $gap={"spacing-16"}
            $alignItems="stretch"
          >
            {items.slice(0, 4).map((item) => (
              <StyledLi key={item.bodyRaw[0]?._key}>
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
              </StyledLi>
            ))}
          </OakFlex>
        </OakFlex>
      </NewGutterMaxWidth>
    </OakFlex>
  );
}
