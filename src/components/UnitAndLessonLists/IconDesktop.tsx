import { FC } from "react";

import { OakColorName } from "../../styles/theme/types";
import Flex from "../Flex";
import Icon from "../Icon";

export type IconDesktopProps = {
  title: string;
  background: OakColorName;
  isHovered: boolean;
};

const IconDesktop: FC<IconDesktopProps> = (props) => {
  const { title, background, isHovered } = props;

  return (
    <Flex
      $justifyContent={"center"}
      $display={["none", "flex"]}
      $alignItems={"center"}
      $minHeight={110}
      $minWidth={130}
      $background={background}
      $position={"relative"}
      $dropShadow={isHovered ? "subjectCardHover" : "subjectCard"}
      $transform={isHovered ? "translateY(-4px)" : null}
      $transition={"all 0.4s ease-out"}
    >
      <Icon size={[50, 92]} name={"rocket"}>
        {title}
      </Icon>
    </Flex>
  );
};

export default IconDesktop;
