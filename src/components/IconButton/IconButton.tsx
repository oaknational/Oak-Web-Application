import { FC } from "react";

import { ButtonOrLinkProps, ButtonOrLink } from "../ButtonOrLink/ButtonOrLink";
import Icon, { IconName } from "../Icon";

type IconButtonProps = ButtonOrLinkProps & {
  icon: IconName;
};
const IconButton: FC<IconButtonProps> = (props) => {
  const { icon, ...buttonOrLinkProps } = props;

  return (
    <ButtonOrLink {...buttonOrLinkProps}>
      <Icon name={icon} />
    </ButtonOrLink>
  );
};

export default IconButton;
