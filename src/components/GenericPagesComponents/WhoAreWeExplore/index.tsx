import {
  OakFlex,
  OakHeading,
  OakBox,
  OakIcon,
  OakIconProps,
  OakFocusIndicator,
  parseSpacing,
} from "@oaknational/oak-components";
import Link from "next/link";
import { useId } from "react";
import styled from "styled-components";

import { aboutUsExplored, ComponentTypeValueType } from "@/browser-lib/avo/Avo";
import { NewGutterMaxWidth } from "@/components/GenericPagesComponents/NewGutterMaxWidth";
import { buildAboutUsAnalytics } from "@/utils/analytics-builders";

const handleClick = (componentType: ComponentTypeValueType) => {
  const aboutUsExploredAnalytics = buildAboutUsAnalytics(componentType);

  return aboutUsExplored(aboutUsExploredAnalytics);
};

const HoverableCard = styled(OakFlex)`
  &:hover {
    box-shadow: 2px 2px 0 0 #ffe555;
  }
`;

const UnstyledLi = styled.li`
  padding: 0;
  margin: 0;
`;

const CustomUlAsGrid = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  row-gap: ${() => parseSpacing("spacing-16")};
  column-gap: ${() => parseSpacing("spacing-16")};
  grid-auto-rows: 1fr;
  grid-template-columns: repeat(3, 1fr);

  @media (max-width: 800px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

export type WhoAreWeExploreProps = {
  title: string;
  items: {
    iconName: OakIconProps["iconName"];
    title: string;
    href: string;
    componentType: ComponentTypeValueType;
  }[];
};
export function WhoAreWeExplore({
  title,
  items,
}: Readonly<WhoAreWeExploreProps>) {
  const headingId = useId();

  return (
    <OakBox $background={"bg-decorative1-main"} $position={"relative"}>
      <OakIcon
        iconName="confetti"
        $position={"absolute"}
        $top={"spacing-0"}
        $left={"spacing-0"}
        $width={"100%"}
        $height={"100%"}
        $display={["none", "block"]}
        $transform={[
          "scale(1)",
          "scale(1.1) translateX(-0.65%) translateY(4%)",
          "scale(1.4) translateY(4%)",
        ]}
        style={{ pointerEvents: "none" }}
      />
      <NewGutterMaxWidth>
        <OakFlex
          $position={"relative"}
          $flexDirection={"column"}
          $pv={["spacing-56", "spacing-80", "spacing-80"]}
          $gap={["spacing-32", "spacing-56", "spacing-56"]}
        >
          <OakHeading
            id={headingId}
            tag="h2"
            $textAlign={"center"}
            $font={["heading-5", "heading-4", "heading-4"]}
          >
            {title}
          </OakHeading>
          <nav aria-labelledby={headingId}>
            <CustomUlAsGrid>
              {items.map(({ title, iconName, href, componentType }) => {
                return (
                  <UnstyledLi key={title}>
                    <OakFocusIndicator $borderRadius={"border-radius-m2"}>
                      <Link
                        style={{ outline: "none" }}
                        href={href}
                        onClick={() => handleClick(componentType)}
                      >
                        <HoverableCard
                          data-testid="who-we-are-explore-item"
                          $flexDirection={"row"}
                          $pa={"spacing-16"}
                          $background={"bg-primary"}
                          $gap={"spacing-16"}
                          $alignItems={"center"}
                          $borderRadius={"border-radius-m2"}
                        >
                          <OakFlex>
                            <OakIcon
                              iconName={iconName}
                              $width={"spacing-56"}
                              $height={"spacing-56"}
                            />
                          </OakFlex>
                          <OakFlex $flexGrow={1} $font={"body-1-bold"}>
                            {title}
                          </OakFlex>
                          <OakFlex>
                            <OakIcon iconName="arrow-right" />
                          </OakFlex>
                        </HoverableCard>
                      </Link>
                    </OakFocusIndicator>
                  </UnstyledLi>
                );
              })}
            </CustomUlAsGrid>
          </nav>
        </OakFlex>
      </NewGutterMaxWidth>
    </OakBox>
  );
}
