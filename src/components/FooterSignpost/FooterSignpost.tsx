import React, { FC } from "react";
import Link from "next/link";

import Box from "../Box/Box";
import { Heading, P } from "../Typography";

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
        <Link href={"mailto:help@thenational.academy"}>
          help@thenational.academy
        </Link>
      </P>
    </Box>
  );
};

export default FooterSignpost;
