import { FC } from "react";

import Flex from "../../Flex";
import Typography from "../../Typography";
import { Quote as QuoteSchema } from "../../../common-lib/cms-types";
import Blockquote from "../../Typography/Blockquote";

export const Quote: FC<QuoteSchema> = ({ text, attribution }) => {
  return (
    <Flex
      $flexDirection={"column"}
      $justifyContent={"center"}
      $alignItems={"center"}
      $mb={[56, 92]}
      $ph={[16]}
      $maxWidth={[720]}
      $ma={"auto"}
    >
      <Blockquote $mb={[16]} $font={"heading-4"} $textAlign={"center"}>
        &ldquo;{text}&rdquo;
      </Blockquote>

      <Typography $font={"body-2"}>{attribution}</Typography>
    </Flex>
  );
};
