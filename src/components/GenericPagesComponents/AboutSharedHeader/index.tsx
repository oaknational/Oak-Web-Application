import {
  OakFlex,
  OakHeading,
  OakBox,
  OakP,
  OakSpan,
  OakImage,
  OakIcon,
  OakUiRoleToken,
} from "@oaknational/oak-components";
import styled from "styled-components";
import { ReactNode } from "react";
import { PortableTextReactComponents } from "@portabletext/react";

import { InnerMaxWidth } from "../InnerMaxWidth";

import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";
import { PortableTextJSON } from "@/common-lib/cms-types";

const CustomOakBox = styled(OakBox)`
  height: 410px;
  width: auto;

  @media (max-width: 920px) {
    display: none;
  }
`;

const StyledBackgroundLoop = styled(OakIcon)`
  height: 125%;
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
    <OakImage
      alt={imageAlt}
      src={imageUrl}
      $objectFit={"contain"}
      $height={"100%"}
      $width={"spacing-360"}
    />
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
  titleHighlight?: OakUiRoleToken;
};
export function AboutSharedHeader({
  title,
  content,
  children,
  titleHighlight,
}: Readonly<AboutSharedHeaderProps>) {
  return (
    <InnerMaxWidth>
      <OakBox
        $position={"relative"}
        $overflow={"hidden"}
      >
        <OakFlex
          $alignItems="center"
          $justifyContent="space-between"
          $pt={["spacing-56", "spacing-72"]}
          $pb={["spacing-56", "spacing-72"]}
          $gap={["spacing-0", "spacing-48", "spacing-240"]}
        >
          <OakFlex
            $flexDirection={"column"}
            $gap={"spacing-24"}
          >
            <OakHeading
              tag="h1"
              $font={["heading-4", "heading-2", "heading-2"]}
            >
              <OakSpan
                $background={titleHighlight ?? "bg-decorative1-main"}
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
          <CustomOakBox>
            {children}
          </CustomOakBox>
        </OakFlex>
      </OakBox>
    </InnerMaxWidth>
  );
}
