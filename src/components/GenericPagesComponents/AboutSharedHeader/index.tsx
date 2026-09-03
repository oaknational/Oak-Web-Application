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

import { NewGutterMaxWidth } from "@/components/GenericPagesComponents/NewGutterMaxWidth";
import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";
import { PortableTextJSON } from "@/common-lib/cms-types";
import { OwaImageProps } from "@/components/SharedComponents/OwaImage";

const IllustrationPanel = styled(OakBox)<{ $showImageOverflow: boolean }>`
  height: 410px;
  width: auto;

  @media (max-width: 920px) {
    display: ${({ $showImageOverflow }) =>
      $showImageOverflow ? "block" : "none"};
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

type AboutSharedHeaderImageProps = {
  imageUrl: string;
  imageAlt?: string;
} & Omit<OwaImageProps, "src" | "alt">;

export function AboutSharedHeaderImage({
  imageAlt,
  imageUrl,
  ...imageProps
}: Readonly<AboutSharedHeaderImageProps>) {
  return (
    <OakImage
      alt={imageAlt ?? ""}
      src={imageUrl}
      $objectFit={"contain"}
      $height={"100%"}
      $width={"spacing-360"}
      {...imageProps}
    />
  );
}

const portableTextComponents: Partial<PortableTextReactComponents> = {
  block: {
    normal: (props) => {
      return (
        <OakP $font={["heading-light-5", "heading-light-3", "heading-light-3"]}>
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
  showImageOverflow?: boolean;
};
export function AboutSharedHeader({
  title,
  content,
  children,
  titleHighlight,
  showImageOverflow = false,
}: Readonly<AboutSharedHeaderProps>) {
  return (
    <NewGutterMaxWidth>
      <OakFlex
        $flexDirection={
          showImageOverflow ? ["column", "row", "row", "row"] : ["row"]
        }
        $alignItems="center"
        $justifyContent="space-between"
        $pt={["spacing-56", "spacing-72"]}
        $pb={["spacing-56", "spacing-72"]}
        $gap={
          showImageOverflow
            ? ["spacing-16"]
            : ["spacing-0", "spacing-48", "spacing-240"]
        }
        $overflow={"hidden"}
      >
        <OakFlex $flexDirection={"column"} $gap={"spacing-24"}>
          <OakHeading tag="h1" $font={["heading-4", "heading-2", "heading-2"]}>
            <OakSpan
              $background={titleHighlight ?? "bg-decorative1-main"}
              $ph={"spacing-4"}
            >
              {title}
            </OakSpan>
          </OakHeading>
          {typeof content === "string" ? (
            <OakP
              $font={["heading-light-5", "heading-light-3", "heading-light-3"]}
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
        <IllustrationPanel $showImageOverflow={showImageOverflow}>
          {children}
        </IllustrationPanel>
      </OakFlex>
    </NewGutterMaxWidth>
  );
}
