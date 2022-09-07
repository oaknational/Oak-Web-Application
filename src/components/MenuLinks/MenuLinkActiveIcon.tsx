import { FC } from "react";

import Flex from "../Flex";
import Icon from "../Icon";

import useIsCurrent from "./useIsCurrent";

type MenuLinkActiveIconProps = {
  href: string;
};
const MenuLinkActiveIcon: FC<MenuLinkActiveIconProps> = (props) => {
  const { href } = props;
  useIsCurrent({ href });
  return (
    <Flex>
      <Icon variant="minimal" name="ArrowRight" size={20} $opacity={0.6} />
    </Flex>
  );
};
export default MenuLinkActiveIcon;
