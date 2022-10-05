import { FC } from "react";

import Flex from "../../Flex";
import Typography, { Heading } from "../../Typography";
import { Quote as QuoteSchema } from "../../../node-lib/cms/sanity-client/schemas/";

export const Quote: FC<QuoteSchema> = ({ text, attribution }) => {
  return (
    <Flex
      $flexDirection={"column"}
      $justifyContent={"center"}
      $alignItems={"center"}
      $mb={[56, 92]}
      $ph={[16]}
      $maxWidth={[720]}
    >
      <Heading tag={"h3"} $mb={[16]} $font={"heading-4"} $textAlign={"center"}>
        "{text}"
      </Heading>
      <Typography $font={"body-2"}>{attribution}</Typography>
    </Flex>
  );
};
