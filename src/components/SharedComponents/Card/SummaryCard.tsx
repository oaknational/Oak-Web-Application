import { FC } from "react";
import {
  OakTypography,
  OakHeading,
  OakFlex,
  OakFlexProps,
  OakUiRoleToken,
} from "@oaknational/oak-components";

import Card from "./Card";

import { PortableTextJSON, Image } from "@/common-lib/cms-types";
import BrushBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BrushBorders";
import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";
import Cover from "@/components/SharedComponents/Cover";
import CMSImage from "@/components/SharedComponents/CMSImage";

export type SummaryCardProps = {
  children?: React.ReactNode;
  title: string;
  heading: string;
  summaryPortableText: PortableTextJSON | string;
  summaryCardImage?: Image | null;
  background?: OakUiRoleToken;
  imageContainerProps?: OakFlexProps;
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
  background = "bg-decorative5-subdued",
  imageContainerProps,
  children,
}) => {
  return (
    <Card
      $pa={"spacing-0"}
      $background={background}
      $flexDirection={"row"}
      $justifyContent={"space-between"}
      $width="100%"
      $pv={["spacing-24"]}
      $ph={["spacing-16", "spacing-24"]}
    >
      <OakFlex $flexDirection={"column"} $width="100%">
        <OakFlex $justifyContent={"space-between"}>
          <OakFlex
            $justifyContent={"center"}
            $flexDirection={"column"}
            $mr="spacing-48"
          >
            <OakHeading
              $mb={"spacing-8"}
              tag={"h1"}
              $font={["heading-6", "heading-5"]}
              $color={"text-subdued"}
            >
              {title}
            </OakHeading>
            <OakHeading
              $mb={"spacing-16"}
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
            <OakFlex
              $display={["none", "flex"]}
              $position="relative"
              $minWidth={["spacing-180", "spacing-240", "spacing-360"]}
              $justifyContent={["center", "flex-end"]}
              $alignItems={["flex-end"]}
              $pr={["spacing-0", "spacing-24"]}
              $pb={"spacing-24"}
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
            </OakFlex>
          )}
        </OakFlex>
        {children}
      </OakFlex>
      <BrushBorders hideOnMobileH color={background || "inherit"} />
    </Card>
  );
};

export default SummaryCard;
