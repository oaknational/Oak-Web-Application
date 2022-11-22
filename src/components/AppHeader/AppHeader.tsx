import { FC } from "react";

import Flex from "../Flex";
import FixedHeader from "../FixedHeader";
import Logo from "../Logo";
import { HeaderProps } from "../Layout/Layout";
import OakLink from "../OakLink";
import Svg from "../Svg";
import Box from "../Box";

/**
 * Header for logging in and using search -
 * header for the app, not a landing page
 *
 */
const AppHeader: FC<HeaderProps> = () => {
  return (
    <FixedHeader $background="pastelTurqoise">
      <Flex $mr={40} $justifyContent={"space-between"}>
        <OakLink page={"home"}>
          <Logo title={"Oak National Academy"} height={48} width={104} />
        </OakLink>
      </Flex>
      <Box
        $position="absolute"
        $height={[8, 12]}
        $bottom={[4, -4]}
        $right={0}
        $left={0}
      >
        <Svg name="HeaderUnderline" $color="teachersHighlight" />
      </Box>
    </FixedHeader>
  );
};

export default AppHeader;
