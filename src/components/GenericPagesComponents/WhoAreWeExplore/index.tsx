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

const HoverableCard = styled(OakFlex)`
  &:hover {
    box-shadow: 2px 2px 0 0 #ffe555;
  }
`;

function InnerMaxWidth({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <OakBox
      $maxWidth={"spacing-1280"}
      $mh={"auto"}
      $ph={["spacing-16", "spacing-16", "spacing-40"]}
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
          $pv={["spacing-56", "spacing-80"]}
          $gap={["spacing-32", "spacing-56"]}
        >
          <OakHeading
            tag="h2"
            $textAlign={"center"}
            $font={["heading-5", "heading-4"]}
            $color={"text-primary"}
            id="explore-more-about-oak"
          >
            {title}
          </OakHeading>
          <nav aria-labelledby="explore-more-about-oak">
            <OakGrid
              $rg={"spacing-16"}
              $cg={"spacing-16"}
              $gridAutoRows={"1fr"}
              $pl="spacing-0"
              as="ul"
            >
              {items.map(({ title, iconName, href }) => {
                return (
                  <OakGridArea key={title} $colSpan={[12, 6]} as="li">
                    <FocusIndicator $borderRadius={"border-radius-m2"}>
                      <HoverableCard
                        data-testid="who-we-are-explore-item"
                        $flexDirection={"row"}
                        $pa={"spacing-16"}
                        $background={"white"}
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
                        <OakFlex
                          $flexGrow={1}
                          $font={"heading-6"}
                          $color={"text-primary"}
                        >
                          <Link href={href}>{title}</Link>
                        </OakFlex>
                        <OakFlex>
                          <OakIcon iconName="arrow-right" />
                        </OakFlex>
                      </HoverableCard>
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
