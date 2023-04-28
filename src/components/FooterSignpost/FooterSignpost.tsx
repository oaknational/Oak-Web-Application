import React, { FC } from "react";

import Box from "../Box/Box";
import { Heading, P } from "../Typography";
import OakLink from "../OakLink";

const FooterSignpost: FC = () => {
  return (
    <Box>
      <Heading tag={"h2"} $font={"heading-7"} $mb={24}>
        Teachers - early access
      </Heading>
      <P $font={["body-2", "body-1"]}>
        You're using our new area for teachers, currently under development and
        testing. To contact us with questions or feedback use our feedback tool
        at the bottom right corner of the screen (look for the question mark) or
        email{" "}
        <OakLink $isInline page={null} href={"mailto:help@thenational.academy"}>
          help@thenational.academy
        </OakLink>
      </P>
    </Box>
  );
};

export default FooterSignpost;
