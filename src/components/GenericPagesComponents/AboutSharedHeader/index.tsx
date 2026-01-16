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
  OakCombinedColorToken,
} from "@oaknational/oak-components";
import styled from "styled-components";
import { ReactNode } from "react";
import { PortableTextReactComponents } from "@portabletext/react";

import { InnerMaxWidth } from "../InnerMaxWidth";

import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";
import { PortableTextJSON } from "@/common-lib/cms-types";

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

const StyledBackgroundLoop = styled(OakIcon)`
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  filter: invert(70%) sepia(24%) saturate(580%) hue-rotate(188deg)
    brightness(100%) contrast(94%);

  @media (min-width: 750px) {
    min-width: 400px;
  }

  @media (min-width: 921px) and (max-width: 1050px) {
    display: block;
    translate: 14% -35%;
    transform: scale(1.65) rotate(-10deg);
  }

  @media (min-width: 1051px) and (max-width: 1180px) {
    translate: 21% -33%;
    transform: scale(1.6) rotate(-9deg);
  }

  @media (min-width: 1181px) and (max-width: 1279px) {
    transform: scale(1.55) rotate(-8.5deg);
    translate: 20% -34%;
  }

  @media (min-width: 1280px) {
    translate: 20% -41%;
    transform: scale(1.7) rotate(-8deg);
  }
`;

export function BackgroundHeaderLoop() {
  return (
    <StyledBackgroundLoop
      iconName="looping-line-5"
      data-testid="about-shared-loop"
    />
  );
}

export function AboutSharedHeaderImage({
  imageAlt,
  imageUrl,
}: Readonly<{
  imageAlt: string;
  imageUrl: string;
}>) {
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

const portableTextComponents: Partial<PortableTextReactComponents> = {
  block: {
    normal: (props) => {
      return (
        <OakP
          $font={["heading-light-5", "heading-light-3", "heading-light-3"]}
          $color={"text-primary"}
        >
          {props.children}
        </OakP>
      );
    },
  },
};

export type AboutSharedHeaderProps = {
  title: string;
  content: PortableTextJSON | string;
  children?: ReactNode;
  titleHighlight?: OakCombinedColorToken;
};
export function AboutSharedHeader({
  title,
  content,
  children,
  titleHighlight,
}: Readonly<AboutSharedHeaderProps>) {
  return (
    <InnerMaxWidth>
      <OakBox $position={"relative"} $overflow={"hidden"}>
        <OakGrid $cg="spacing-16" $rg="spacing-16" $pv={"spacing-72"}>
          <CustomHeaderTextOakGridArea $colSpan={12} $justifyContent={"center"}>
            <OakFlex $flexDirection={"column"} $gap={"spacing-24"}>
              <OakHeading
                tag="h1"
                $font={["heading-4", "heading-2", "heading-2"]}
              >
                <OakSpan
                  $background={titleHighlight ?? "mint"}
                  $ph={"spacing-4"}
                  $color="text-primary"
                >
                  {title}
                </OakSpan>
              </OakHeading>
              {typeof content === "string" ? (
                <OakP
                  $font={[
                    "heading-light-5",
                    "heading-light-3",
                    "heading-light-3",
                  ]}
                  $color={"text-primary"}
                >
                  {content}
                </OakP>
              ) : (
                <PortableTextWithDefaults
                  value={content}
                  withoutDefaultComponents={true}
                  components={portableTextComponents}
                />
              )}
            </OakFlex>
          </CustomHeaderTextOakGridArea>
          <CustomHeaderImageOakGridArea $colSpan={4} $colStart={9}>
            {children}
          </CustomHeaderImageOakGridArea>
        </OakGrid>
      </OakBox>
    </InnerMaxWidth>
  );
}
