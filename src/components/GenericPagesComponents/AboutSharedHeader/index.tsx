import {
  OakFlex,
  OakGrid,
  OakGridArea,
  OakHeading,
  OakBox,
  OakP,
  OakSpan,
  OakImage,
  OakIcon,
} from "@oaknational/oak-components";
import styled from "styled-components";
import { ReactNode, useMemo } from "react";

const CustomHeaderTextOakGridArea = styled(OakGridArea)`
  grid-column: span 6;
  @media (max-width: 920px) {
    grid-column: span 12;
  }
`;

const CustomHeaderImageOakGridArea = styled(OakGridArea)`
  display: block;
  @media (max-width: 920px) {
    display: none;
  }
`;

function InnerMaxWidth({ children }: { children: ReactNode }) {
  const styleAttrs = useMemo(() => ({ maxWidth: 1280 + 40 * 2 }), []);
  return (
    <OakBox
      style={styleAttrs}
      $mh={"auto"}
      $ph={["spacing-16", "spacing-16", "spacing-16"]}
    >
      {children}
    </OakBox>
  );
}

export function BackgroundHeaderLoop() {
  return (
    <OakIcon
      iconName="looping-line-5"
      $colorFilter={"bg-decorative3-main"}
      $zIndex={"behind"}
      $objectFit={"fill"}
      $display={["none", "block"]}
      $height={"100%"}
      $minWidth={[0, "spacing-480", "spacing-640"]}
      $transform={[
        "none",
        "translate(140%, -40%) scale(1.5) rotate(-11deg)",
        "translate(140%, -55%) scale(1.25) rotate(-8deg)",
      ]}
      $position={"absolute"}
      $left={"spacing-0"}
      $right={"spacing-0"}
      $top={"spacing-0"}
      $bottom={"spacing-0"}
      data-testid="about-shared-loop"
    />
  );
}

export function AboutSharedHeaderImage({
  imageAlt,
  imageUrl,
}: {
  imageAlt: string;
  imageUrl: string;
}) {
  return (
    <OakBox $width={"spacing-360"} $height={"spacing-360"}>
      <OakImage
        alt={imageAlt}
        src={imageUrl}
        $objectFit={"contain"}
        $height={"100%"}
      />
    </OakBox>
  );
}

export type AboutSharedHeaderProps = {
  title: string;
  content: string;
  children?: React.ReactNode;
};
export function AboutSharedHeader({
  title,
  content,
  children,
}: Readonly<AboutSharedHeaderProps>) {
  return (
    <InnerMaxWidth>
      <OakGrid $cg="spacing-16" $rg="spacing-16" $pv={"spacing-72"}>
        <CustomHeaderTextOakGridArea $colSpan={12} $justifyContent={"center"}>
          <OakFlex $flexDirection={"column"} $gap={"spacing-24"}>
            <OakHeading
              tag="h1"
              $font={["heading-4", "heading-2", "heading-2"]}
            >
              <OakSpan
                $background="bg-decorative3-main"
                $ph={"spacing-4"}
                $color="text-primary"
              >
                {title}
              </OakSpan>
            </OakHeading>
            <OakP
              $font={["heading-light-5", "heading-light-3", "heading-light-3"]}
              $color={"text-primary"}
            >
              {content}
            </OakP>
          </OakFlex>
        </CustomHeaderTextOakGridArea>
        <CustomHeaderImageOakGridArea $colSpan={4} $colStart={9}>
          {children}
        </CustomHeaderImageOakGridArea>
      </OakGrid>
    </InnerMaxWidth>
  );
}
