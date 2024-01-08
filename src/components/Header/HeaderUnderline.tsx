import { FC } from "react";

import Box from "@/components/SharedComponents/Box";
import Svg from "@/components/SharedComponents/Svg";

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
