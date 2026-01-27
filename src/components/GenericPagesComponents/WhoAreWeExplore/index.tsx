import {
  OakFlex,
  OakGrid,
  OakGridArea,
  OakHeading,
  OakBox,
  OakIcon,
  OakIconProps,
  OakFocusIndicator,
} from "@oaknational/oak-components";
import Link from "next/link";
import { ReactNode } from "react";
import styled from "styled-components";

const HoverableCard = styled(OakFlex)`
  &:hover {
    box-shadow: 2px 2px 0 0 #ffe555;
  }
`;

function InnerMaxWidth({ children }: { children: ReactNode }) {
  return (
    <OakBox
      $maxWidth={"spacing-1280"}
      $mh={"auto"}
      $ph={["spacing-16", "spacing-16", "spacing-40"]}
      $position={"relative"}
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
      <InnerMaxWidth data-testid="test">
        <OakFlex
          $flexDirection={"column"}
          $pv={["spacing-56", "spacing-80", "spacing-80"]}
          $gap={["spacing-32", "spacing-56", "spacing-56"]}
        >
          <OakHeading
            tag="h2"
            $textAlign={"center"}
            $font={["heading-5", "heading-4", "heading-4"]}
            $color="text-primary"
          >
            {title}
          </OakHeading>
          <OakGrid $rg={"spacing-16"} $cg={"spacing-16"} $gridAutoRows={"1fr"}>
            {items.map(({ title, iconName, href }) => {
              return (
                <OakGridArea key={title} $colSpan={[12, 6, 6]}>
                  <OakFocusIndicator $borderRadius={"border-radius-m2"}>
                    <Link style={{ outline: "none" }} href={href}>
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
                        <OakFlex
                          $flexGrow={1}
                          $font={"body-1-bold"}
                          $color="text-primary"
                        >
                          {title}
                        </OakFlex>
                        <OakFlex>
                          <OakIcon iconName="arrow-right" />
                        </OakFlex>
                      </HoverableCard>
                    </Link>
                  </OakFocusIndicator>
                </OakGridArea>
              );
            })}
          </OakGrid>
        </OakFlex>
      </InnerMaxWidth>
    </OakBox>
  );
}
