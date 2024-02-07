import { FC } from "react";
import { OakTypography } from "@oaknational/oak-components";

import { PortableTextJSON } from "@/common-lib/cms-types";
import Flex from "@/components/SharedComponents/Flex";
import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";

export const LandingPageTextBlock: FC<{
  bodyPortableText: PortableTextJSON;
}> = (props) => {
  return (
    <Flex $ph={[16]} $justifyContent={"center"} $mb={[56, 92]}>
      <OakTypography $maxWidth="all-spacing-22" $font={["body-2", "body-1"]}>
        <PortableTextWithDefaults value={props.bodyPortableText} />
      </OakTypography>
    </Flex>
  );
};
