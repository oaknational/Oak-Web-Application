import { FC } from "react";
import { OakTypography } from "@oaknational/oak-components";

import { Quote as QuoteSchema } from "@/common-lib/cms-types";
import Blockquote from "@/components/SharedComponents/Typography/Blockquote";
import Flex from "@/components/SharedComponents/Flex.deprecated";

export const LandingPageQuote: FC<QuoteSchema> = ({ text, attribution }) => {
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
      <Blockquote
        $mb={["space-between-s"]}
        $font={"heading-4"}
        $textAlign={"center"}
      >
        &ldquo;{text}&rdquo;
      </Blockquote>

      <OakTypography $font={"body-2"}>{attribution}</OakTypography>
    </Flex>
  );
};
