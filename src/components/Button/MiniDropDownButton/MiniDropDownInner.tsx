import { FC } from "react";

import ButtonLabel from "@/components/Button/ButtonLabel";
import Icon, { IconName } from "@/components/Icon";
import Flex from "@/components/SharedComponents/Flex";

type MiniDropDownInnerProps = {
  label: string;
  icon: IconName;
  isHovered: boolean;
  isExpanded: boolean;
};

const MiniDropDownInner: FC<MiniDropDownInnerProps> = ({
  label,
  icon,
  isHovered,
  isExpanded,
}) => {
  return (
    <Flex
      $alignItems={"center"}
      $textDecoration={isHovered ? "underline" : "none"}
    >
      <ButtonLabel $color={isExpanded ? "navy120" : "navy"}>
        {label}
      </ButtonLabel>
      <Icon name={icon} />
    </Flex>
  );
};

export default MiniDropDownInner;
