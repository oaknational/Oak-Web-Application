import React, { FC } from "react";

import { P } from "@/components/SharedComponents/Typography";
import Box from "@/components/SharedComponents/Box";

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
