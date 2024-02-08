import { FC } from "react";
import { OakHeading, OakP } from "@oaknational/oak-components";

import Box from "@/components/SharedComponents/Box";

const NoResourcesToShare: FC = () => (
  <Box $ph={24} $mb={64} $mt={56}>
    <OakHeading
      $mb="space-between-s"
      $mt="space-between-m"
      $font={["heading-6", "heading-7"]}
      tag={"h2"}
    >
      No resources to share
    </OakHeading>
    <OakP $mb="space-between-m" $font={["body-2", "body-1"]}>
      Sorry, there are no teaching resources available to share for this lesson.
    </OakP>
  </Box>
);

export default NoResourcesToShare;
