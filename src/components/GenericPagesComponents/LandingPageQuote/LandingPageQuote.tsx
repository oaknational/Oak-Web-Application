import { FC } from "react";
import { OakFlex, OakTypography } from "@oaknational/oak-components";

import { Quote as QuoteSchema } from "@/common-lib/cms-types";
import Blockquote from "@/components/SharedComponents/Typography/Blockquote";

export const LandingPageQuote: FC<QuoteSchema> = ({ text, attribution }) => {
  return (
    <OakFlex
      $flexDirection={"column"}
      $justifyContent={"center"}
      $alignItems={"center"}
      $mb={["spacing-56", "spacing-80"]}
      $ph={"spacing-16"}
      $maxWidth={"spacing-640"}
      $ma={"auto"}
    >
      <Blockquote
        $mb={["spacing-16"]}
        $font={"heading-4"}
        $textAlign={"center"}
      >
        &ldquo;{text}&rdquo;
      </Blockquote>
      <OakTypography $font={"body-2"}>{attribution}</OakTypography>
    </OakFlex>
  );
};
