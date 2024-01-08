import { FC } from "react";

import { Heading, P } from "../../Typography";

import Box from "@/components/SharedComponents/Box";

const NoResourcesToShare: FC = () => (
  <Box $ph={24} $mb={64} $mt={56}>
    <Heading $mb={16} $mt={24} $font={["heading-6", "heading-7"]} tag={"h2"}>
      No resources to share
    </Heading>
    <P $mb={24} $font={["body-2", "body-1"]}>
      Sorry, there are no teaching resources available to share for this lesson.
    </P>
  </Box>
);

export default NoResourcesToShare;
