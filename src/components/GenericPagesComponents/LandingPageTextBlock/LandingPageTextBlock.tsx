import { FC } from "react";
import { OakTypography, OakFlex } from "@oaknational/oak-components";

import { PortableTextJSON } from "@/common-lib/cms-types";
import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";

export const LandingPageTextBlock: FC<{
  bodyPortableText: PortableTextJSON;
}> = (props) => {
  return (
    <OakFlex
      $ph={["spacing-16"]}
      $justifyContent={"center"}
      $mb={["spacing-56", "spacing-80"]}
    >
      <OakTypography $maxWidth="spacing-640" $font={["body-2", "body-1"]}>
        <PortableTextWithDefaults value={props.bodyPortableText} />
      </OakTypography>
    </OakFlex>
  );
};
