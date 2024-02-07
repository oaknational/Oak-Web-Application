import React, { FC } from "react";
import { OakP } from "@oaknational/oak-components";

import Box from "@/components/SharedComponents/Box";

type AppHeaderMenuSidebarSignpostProps = {
  display: string | string[];
};

const AppHeaderMenuSidebarSignpost: FC<AppHeaderMenuSidebarSignpostProps> = ({
  display,
}) => {
  return (
    <Box $mb={[48, 64]} $display={display} $width={[320, 480]}>
      <OakP $font={["body-2", "body-1"]}>
        You're using our new area for teachers, currently under development and
        testing.
      </OakP>
    </Box>
  );
};

export default AppHeaderMenuSidebarSignpost;
