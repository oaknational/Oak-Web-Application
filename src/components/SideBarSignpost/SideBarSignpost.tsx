import React, { FC } from "react";

import Box from "../Box/Box";
import { P } from "../Typography";

type SideBarSignpostProps = {
  display: string | string[];
};

const SideBarSignpost: FC<SideBarSignpostProps> = ({ display }) => {
  return (
    <Box $mb={[48, 64]} $display={display} $width={[320, 480]}>
      <P $font={["body-2", "body-1"]}>
        You're using our new area for teachers, currently under development and
        testing.
      </P>
    </Box>
  );
};

export default SideBarSignpost;
