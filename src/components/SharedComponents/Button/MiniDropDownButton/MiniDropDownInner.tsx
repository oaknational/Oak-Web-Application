import { FC } from "react";
import { OakFlex } from "@oaknational/oak-components";

import ButtonLabel from "@/components/SharedComponents/Button/ButtonLabel";
import Icon, { IconName } from "@/components/SharedComponents/Icon";

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
    <OakFlex
      $alignItems={"center"}
      $textDecoration={isHovered ? "underline" : "none"}
      $zIndex={"in-front"}
    >
      <ButtonLabel $color={isExpanded ? "navy120" : "navy"}>
        {label}
      </ButtonLabel>
      <Icon $color={isExpanded ? "navy120" : "navy"} name={icon} />
    </OakFlex>
  );
};

export default MiniDropDownInner;
