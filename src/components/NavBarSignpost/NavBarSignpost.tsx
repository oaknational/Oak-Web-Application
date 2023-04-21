import React, { FC } from "react";

import { MarginProps } from "../../styles/utils/spacing";
import Box from "../Box/Box";
import { P } from "../Typography";

type NavBarSignpostProps = {
  mb?: MarginProps["$mb"];
  display: string | string[];
};

const NavBarSignpost: FC<NavBarSignpostProps> = ({ mb, display }) => {
  return (
    <Box $mb={mb} $display={display} $width={[300, 480]}>
      <P $font={["body-3", "body-2"]}>
        You're using our new area for teachers, currently under development and
        testing.
      </P>
    </Box>
  );
};

export default NavBarSignpost;
