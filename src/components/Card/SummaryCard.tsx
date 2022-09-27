import { FC } from "react";
import { PortableText } from "@portabletext/react";

import { PortableTextJSON } from "../../node-lib/cms";
import Flex, { FlexProps } from "../Flex";
import Typography, { Heading } from "../Typography";
import { OakColorName } from "../../styles/theme/types";
import Cover from "../Cover";
import OakImage from "../OakImage/OakImage";
import BrushBorders from "../SpriteSheet/BrushSvgs/BrushBorders";

import Card from "./Card";

type ImageProps = {
  src: string;
  alt: string;
};

type SummaryCardProps = {
  title: string;
  heading: string;
  summary: PortableTextJSON;
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
  summary,
  background,
  imageProps,
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
      <Flex
        $justifyContent={"center"}
        $flexDirection={"column"}
        $maxWidth={812}
        $mr={48}
      >
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
          {typeof summary === "string" ? (
            <p>{summary}</p>
          ) : (
            <PortableText value={summary} />
          )}
        </Typography>
        {children}
      </Flex>
      {imageProps && (
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
            <OakImage
              aria-hidden={true}
              $objectFit="contain"
              $objectPosition={"right"}
              alt={imageProps.alt}
              src={imageProps.src}
              fill
              priority
            />
          </Cover>
        </Flex>
      )}
      <BrushBorders hideOnMobileH color={background || "inherit"} />
    </Card>
  );
};

SummaryCard.defaultProps = {
  background: "teachersPastelYellow",
};

export default SummaryCard;
