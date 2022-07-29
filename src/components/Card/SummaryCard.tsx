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
};

/**
 * Contains an heading, title, and image.
 * image disapears on mobile
 *
 * ## Usage
 * Summary card heading used at the top of page
 */

const SummaryCard: FC<SummaryCardProps & CardImageProps> = ({
  title,
  heading,
  summary,
  imageSrc,
  alt,
  background,
}) => {
  return (
    <Card
      mt={[72, 80, 80]}
      mb={[40, 80, 80]}
      background={background}
      flexDirection={"row"}
      justifyContent={"space-between"}
    >
      <Flex flexDirection={"column"}>
        <Heading
          mb={16}
          tag={"h2"}
          fontSize={20}
          lineHeight={24}
          color={"grey4"}
        >
          {title}
        </Heading>
        <Heading
          mb={16}
          color={"black"}
          fontSize={[24, 32, 32]}
          lineHeight={40}
          tag={"h1"}
        >
          {heading}
        </Heading>
        <Typography color="black" fontSize={16}>
          {typeof summary === "string" ? (
            <p>{summary}</p>
          ) : (
            <PortableText value={summary} />
          )}
        </Typography>
      </Flex>
      <Flex width={"100%"} alignItems={"center"} justifyContent={"center"}>
        <CardImage
          alt={alt}
          imageSrc={imageSrc}
          position={"center right"}
        ></CardImage>
      </Flex>
    </Card>
  );
};

export default SummaryCard;
