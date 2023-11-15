import { FC } from "react";

import { PortableTextJSON } from "@/common-lib/cms-types";
import Flex from "@/components/Flex";
import Typography from "@/components/Typography";
import { PortableTextWithDefaults } from "@/components/PortableText";

export const LandingPageTextBlock: FC<{
  bodyPortableText: PortableTextJSON;
}> = (props) => {
  return (
    <Flex $ph={[16]} $justifyContent={"center"} $mb={[56, 92]}>
      <Typography $maxWidth={720} $font={["body-2", "body-1"]}>
        <PortableTextWithDefaults value={props.bodyPortableText} />
      </Typography>
    </Flex>
  );
};
