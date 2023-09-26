import { FC } from "react";

import Box from "@/components/Box";
import Svg from "@/components/Svg";

export const HeaderUnderline: FC = () => {
  return (
    <Box
      $position="absolute"
      $zIndex="behind"
      $height={4}
      $top={56}
      $right={0}
      $left={0}
    >
      <Svg name="header-underline" $color="black" />
    </Box>
  );
};
