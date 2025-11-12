import {
  OakFlex,
  OakGrid,
  OakGridArea,
  OakHeading,
  OakBox,
  OakIcon,
  OakIconProps,
} from "@oaknational/oak-components";
import Link from "next/link";
import { ReactNode } from "react";
import styled from "styled-components";

import FocusIndicator from "@/components/CurriculumComponents/OakComponentsKitchen/FocusIndicator";

const StyledLink = styled(Link)`
  text-decoration: none;
  outline: none;
  display: block;

  &:hover > div {
    box-shadow: 2px 2px 0 0 #ffe555;
  }
`;

function InnerMaxWidth({ children }: { children: ReactNode }) {
  return (
    <OakBox
      $maxWidth={"all-spacing-24"}
      $mh={"auto"}
      $ph={["inner-padding-m", "inner-padding-m", "inner-padding-xl3"]}
    >
      {children}
    </OakBox>
  );
}

export type WhoAreWeExploreProps = {
  title: string;
  items: {
    iconName: OakIconProps["iconName"];
    title: string;
    href: string;
  }[];
};
export function WhoAreWeExplore({
  title,
  items,
}: Readonly<WhoAreWeExploreProps>) {
  return (
    <OakBox $background={"mint"}>
      <InnerMaxWidth data-testid="test">
        <OakFlex
          $flexDirection={"column"}
          $pv={["inner-padding-xl5", "inner-padding-xl8"]}
          $gap={["all-spacing-7", "all-spacing-10"]}
        >
          <OakHeading
            tag="h2"
            $textAlign={"center"}
            $font={["heading-5", "heading-4"]}
            id="explore-more-about-oak"
          >
            {title}
          </OakHeading>
          <nav aria-labelledby="explore-more-about-oak">
            <OakGrid
              $rg={"all-spacing-4"}
              $cg={"all-spacing-4"}
              $gridAutoRows={"1fr"}
              as="ul"
            >
              {items.map(({ title, iconName, href }) => {
                return (
                  <OakGridArea key={title} $colSpan={[12, 6]} as="li">
                    <FocusIndicator $borderRadius={"border-radius-m2"}>
                      <StyledLink href={href}>
                        <OakFlex
                          data-testid="who-we-are-explore-item"
                          $flexDirection={"row"}
                          $pa={"inner-padding-m"}
                          $background={"white"}
                          $gap={"all-spacing-4"}
                          $alignItems={"center"}
                          $borderRadius={"border-radius-m2"}
                        >
                          <OakFlex>
                            <OakIcon
                              iconName={iconName}
                              $width={"all-spacing-10"}
                              $height={"all-spacing-10"}
                            />
                          </OakFlex>
                          <OakFlex $flexGrow={1} $font={"body-1-bold"}>
                            {title}
                          </OakFlex>
                          <OakFlex>
                            <OakIcon iconName="arrow-right" />
                          </OakFlex>
                        </OakFlex>
                      </StyledLink>
                    </FocusIndicator>
                  </OakGridArea>
                );
              })}
            </OakGrid>
          </nav>
        </OakFlex>
      </InnerMaxWidth>
    </OakBox>
  );
}
