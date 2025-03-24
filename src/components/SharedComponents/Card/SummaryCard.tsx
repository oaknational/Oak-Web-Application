import { FC } from "react";
import {
  OakTypography,
  OakHeading,
  OakFlex,
} from "@oaknational/oak-components";

import Card from "./Card";

import { PortableTextJSON, Image } from "@/common-lib/cms-types";
import { OakColorName } from "@/styles/theme/types";
import BrushBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BrushBorders";
import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";
import Cover from "@/components/SharedComponents/Cover";
import CMSImage from "@/components/SharedComponents/CMSImage";
import Flex, { FlexProps } from "@/components/SharedComponents/Flex.deprecated";

export type SummaryCardProps = {
  children?: React.ReactNode;
  title: string;
  heading: string;
  summaryPortableText: PortableTextJSON | string;
  summaryCardImage?: Image | null;
  background?: OakColorName;
  imageContainerProps?: FlexProps;
};

/**
 * Contains an heading, title, and optional image.
 * image disapears on mobile
 * Optional imageContainerProps for image size variants
 *
 * ## Usage
 * Summary card heading used at the top of page
 */
const SummaryCard: FC<SummaryCardProps> = ({
  title,
  heading,
  summaryPortableText,
  summaryCardImage,
  background = "lemon50",
  imageContainerProps,
  children,
}) => {
  return (
    <Card
      $pa={0}
      $background={background}
      $flexDirection={"row"}
      $justifyContent={"space-between"}
      $width="100%"
      $pv={[24]}
      $ph={[16, 24]}
    >
      <OakFlex $flexDirection={"column"} $width="100%">
        <OakFlex>
          <OakFlex
            $justifyContent={"center"}
            $flexDirection={"column"}
            $mr="space-between-l"
          >
            <OakHeading
              $mb={"space-between-ssx"}
              tag={"h1"}
              $font={["heading-6", "heading-5"]}
              $color={"grey60"}
            >
              {title}
            </OakHeading>
            <OakHeading
              $mb={"space-between-s"}
              $font={["heading-5", "heading-4"]}
              tag={"h2"}
            >
              {heading}
            </OakHeading>
            <OakTypography $font={["body-2", "body-1"]}>
              {typeof summaryPortableText === "string" ? (
                <p>{summaryPortableText}</p>
              ) : (
                <PortableTextWithDefaults value={summaryPortableText} />
              )}
            </OakTypography>
          </OakFlex>
          {summaryCardImage && (
            <Flex
              $display={["none", "flex"]}
              $position="relative"
              $minWidth={"30%"}
              $justifyContent={["center", "flex-end"]}
              $alignItems={["flex-end"]}
              $pr={[0, 24]}
              $pb={24}
              {...imageContainerProps}
            >
              <Cover>
                <CMSImage
                  width={400}
                  height={400}
                  noCrop
                  $ml={"auto"}
                  aria-hidden={true}
                  $objectFit="contain"
                  $objectPosition={"right"}
                  image={summaryCardImage}
                  priority
                />
              </Cover>
            </Flex>
          )}
        </OakFlex>
        {children}
      </OakFlex>
      <BrushBorders hideOnMobileH color={background || "inherit"} />
    </Card>
  );
};

export default SummaryCard;
