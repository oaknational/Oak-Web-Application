import { FC } from "react";
import { OakHeading, OakP } from "@oaknational/oak-components";

import Box from "@/components/SharedComponents/Box";

const NoResourcesToDownload: FC = () => (
  <Box $ph={24} $mb={64} $mt={56}>
    <OakHeading
      $mb="space-between-s"
      $mt="space-between-m"
      $font={["heading-6", "heading-7"]}
      tag={"h2"}
    >
      No downloads available
    </OakHeading>
    <OakP $mb="space-between-m" $font={["body-2", "body-1"]}>
      Sorry, there are no downloadable teaching resources available for this
      lesson.
    </OakP>
  </Box>
);

export default NoResourcesToDownload;
