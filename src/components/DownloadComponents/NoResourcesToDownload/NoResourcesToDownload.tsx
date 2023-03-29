import { FC } from "react";

import { Heading, P } from "../../Typography";
import Box from "../../Box";

const NoResourcesToDownload: FC = () => (
  <Box $ph={24} $mb={64} $mt={56}>
    <Heading $mb={16} $mt={24} $font={["heading-6", "heading-7"]} tag={"h2"}>
      No downloads available
    </Heading>
    <P $mb={24} $font={["body-2", "body-1"]}>
      Sorry, there are no downloadable teaching resources available for this
      lesson.
    </P>
  </Box>
);

export default NoResourcesToDownload;
