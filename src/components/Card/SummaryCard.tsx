import { FC } from "react";
import { PortableText } from "@portabletext/react";
import type { PortableTextSpan } from "@portabletext/types";

import Flex from "../Flex";
import Typography, { Heading } from "../Typography";
import { OakColorName } from "../../styles/theme/types";

import Card from "./Card";
import CardImage, { CardImageProps } from "./CardComponents/CardImage";

type SummaryCardProps = {
  title: string;
  heading: string;
  summary: PortableTextSpan | string;
  background: OakColorName;
  image?: CardImageProps;
};

/**
 * Contains an heading, title, and image.
 * image disapears on mobile
 *
 * ## Usage
 * Summary card heading used at the top of page
 */
const SummaryCard: FC<SummaryCardProps> = ({
  title,
  heading,
  summary,
  image,
  background,
  children,
}) => {
  return (
    <Card
      $background={background}
      $flexDirection={"row"}
      $justifyContent={"space-between"}
      $ph={[16, 24]}
      $pv={24}
    >
      <Flex $flexDirection={"column"} $pv={[0, 32]}>
        <Heading
          $mb={8}
          tag={"h1"}
          $fontSize={20}
          $color={"oakGrey4"}
          $fontFamily="headingLight"
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
        {children}
      </Flex>
      {image && (
        <Flex
          $ml={[0, 40, 120]}
          $minWidth={240}
          $display={["none", "flex"]}
          $alignItems="center"
        >
          <CardImage {...image} position={"center right"} aspectRatio="1:1" />
        </Flex>
      )}
    </Card>
  );
};

export default SummaryCard;
