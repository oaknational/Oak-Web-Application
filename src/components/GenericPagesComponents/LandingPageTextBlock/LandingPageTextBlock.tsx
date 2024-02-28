import { FC } from "react";
import { OakTypography, OakFlex } from "@oaknational/oak-components";

import { PortableTextJSON } from "@/common-lib/cms-types";
import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";

export const LandingPageTextBlock: FC<{
  bodyPortableText: PortableTextJSON;
}> = (props) => {
  return (
    <OakFlex
      $ph={["inner-padding-m"]}
      $justifyContent={"center"}
      $mb={["space-between-xl", "space-between-xxxl"]}
    >
      <OakTypography $maxWidth="all-spacing-22" $font={["body-2", "body-1"]}>
        <PortableTextWithDefaults value={props.bodyPortableText} />
      </OakTypography>
    </OakFlex>
  );
};
