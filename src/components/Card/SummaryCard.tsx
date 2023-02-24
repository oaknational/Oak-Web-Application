import { FC } from "react";
import { PortableText } from "@portabletext/react";

import { PortableTextJSON, Image } from "../../common-lib/cms-types";
import Flex, { FlexProps } from "../Flex";
import Typography, { Heading } from "../Typography";
import { OakColorName } from "../../styles/theme/types";
import Cover from "../Cover";
import BrushBorders from "../SpriteSheet/BrushSvgs/BrushBorders";
import CMSImage from "../CMSImage";

import Card from "./Card";

type ImageProps = {
  src: string;
  alt: string;
};

export type SummaryCardProps = {
  children?: React.ReactNode;
  title: string;
  heading: string;
  summaryPortableText: PortableTextJSON | string;
  summaryCardImage?: Image | null;
  background?: OakColorName;
  imageProps?: ImageProps;
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
  background,
  // imageProps,
  imageContainerProps,
  children,
}) => {
  console.log(summaryCardImage);

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
      <Flex $flexDirection={"column"} $width="100%">
        <Flex>
          <Flex $justifyContent={"center"} $flexDirection={"column"} $mr={48}>
            <Heading
              $mb={8}
              tag={"h1"}
              $font={["heading-6", "heading-5"]}
              $color={"oakGrey4"}
            >
              {title}
            </Heading>
            <Heading $mb={16} $font={["heading-5", "heading-4"]} tag={"h2"}>
              {heading}
            </Heading>
            <Typography $font={["body-2", "body-1"]}>
              {typeof summaryPortableText === "string" ? (
                <p>{summaryPortableText}</p>
              ) : (
                <PortableText value={summaryPortableText} />
              )}
            </Typography>
          </Flex>
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
                  aria-hidden={true}
                  $objectFit="contain"
                  $objectPosition={"right"}
                  image={summaryCardImage}
                  fill
                  priority
                />
              </Cover>
            </Flex>
          )}
        </Flex>
        {children}
      </Flex>

      <BrushBorders hideOnMobileH color={background || "inherit"} />
    </Card>
  );
};

SummaryCard.defaultProps = {
  background: "teachersPastelYellow",
};

export default SummaryCard;
