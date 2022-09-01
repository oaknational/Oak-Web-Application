import { FC } from "react";
import { PortableText } from "@portabletext/react";
import type { PortableTextSpan } from "@portabletext/types";

import Flex from "../Flex";
import Typography, { Heading } from "../Typography";
import { OakColorName } from "../../styles/theme/types";
import { SizeValues } from "../../styles/utils/size";

import Card from "./Card";
import CardImage, { CardImageProps } from "./CardComponents/CardImage";

type SummaryCardProps = {
  title: string;
  heading: string;
  summary: PortableTextSpan | string;
  background?: OakColorName;
  cardImageProps?: CardImageProps;
  imageMinWidth?: SizeValues;
  textMaxWidth?: SizeValues;
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
  background,
  cardImageProps,
  imageMinWidth = 240,
  textMaxWidth = 720,
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
      <Flex $flexDirection={"column"} $maxWidth={textMaxWidth}>
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
        {children}
      </Flex>
      {cardImageProps && (
        <Flex
          $ml={[0, 40, 120]}
          $minWidth={imageMinWidth}
          $display={["none", "flex"]}
          $alignItems="center"
        >
          <CardImage
            position={"center right"}
            aspectRatio="1:1"
            /* defaulting priority image, as summary card is always above the fold */
            priority
            {...cardImageProps}
          />
        </Flex>
      )}
    </Card>
  );
};

SummaryCard.defaultProps = {
  background: "teachersPastelYellow",
};

export default SummaryCard;
