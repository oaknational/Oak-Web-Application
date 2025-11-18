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

import FocusIndicator from "@/components/CurriculumComponents/OakComponentsKitchen/FocusIndicator";

function InnerMaxWidth({ children }: { children: ReactNode }) {
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
          $pv={["spacing-56", "spacing-80", "spacing-80"]}
          $gap={["spacing-32", "spacing-56", "spacing-56"]}
        >
          <OakHeading
            tag="h2"
            $textAlign={"center"}
            $font={["heading-5", "heading-4", "heading-4"]}
          >
            {title}
          </OakHeading>
          <OakGrid $rg={"spacing-16"} $cg={"spacing-16"} $gridAutoRows={"1fr"}>
            {items.map(({ title, iconName, href }) => {
              return (
                <OakGridArea key={title} $colSpan={[12, 6, 6]}>
                  <FocusIndicator $borderRadius={"border-radius-m2"}>
                    <Link style={{ outline: "none" }} href={href}>
                      <OakFlex
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
                        <OakFlex $flexGrow={1} $font={"body-1-bold"}>
                          {title}
                        </OakFlex>
                        <OakFlex>
                          <OakIcon iconName="arrow-right" />
                        </OakFlex>
                      </OakFlex>
                    </Link>
                  </FocusIndicator>
                </OakGridArea>
              );
            })}
          </OakGrid>
        </OakFlex>
      </InnerMaxWidth>
    </OakBox>
  );
}
