import { FC } from "react";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import type { PortableTextSpan } from "@portabletext/types";

import Flex, { FlexProps } from "../Flex";
import Typography, { Heading } from "../Typography";
import { OakColorName } from "../../styles/theme/types";
import Cover from "../Cover";

import Card from "./Card";

type ImageProps = {
  src: string;
  alt: string;
};

type SummaryCardProps = {
  title: string;
  heading: string;
  summary: PortableTextSpan | string;
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
      >
        <Heading
          $mb={8}
          tag={"h1"}
          $fontSize={20}
          $color={"oakGrey4"}
          $fontFamily="heading"
        >
          {title}
        </Heading>
        <Heading $mb={16} $color={"black"} $fontSize={[24, 32, 32]} tag={"h2"}>
          {heading}
        </Heading>
        <Typography $color="black" $fontSize={16}>
          {typeof summary === "string" ? (
            <p>{summary}</p>
          ) : (
            <PortableText value={summary} />
          )}
        </Typography>
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
            <Image
              aria-hidden={true}
              layout="fill"
              objectFit="contain"
              objectPosition={"right"}
              alt={imageProps.alt}
              src={imageProps.src}
            />
          </Cover>
        </Flex>
      )}
    </Card>
  );
};

SummaryCard.defaultProps = {
  background: "teachersPastelYellow",
};

export default SummaryCard;
