import { FC } from "react";

import { OakColorName } from "../../styles/theme/types";
import Flex from "../Flex";
import Icon from "../Icon";

export type IconMobileProps = {
  title: string;
  background: OakColorName;
};

const IconMobile: FC<IconMobileProps> = (props) => {
  const { title, background } = props;

  return (
    <Flex
      $justifyContent={"center"}
      $display={["flex", "none"]}
      $alignItems={"center"}
      $minHeight={72}
      $minWidth={72}
      $background={background}
      $position={"relative"}
      $ml={"auto"}
    >
      <Icon size={[50, 92]} name={"rocket"}>
        {title}
      </Icon>
    </Flex>
  );
};

export default IconMobile;
