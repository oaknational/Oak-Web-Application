import { FC } from "react";

import Icon, { IconName } from "../Icon";

import ButtonIconWrapper from "./ButtonIconWrapper";
import ButtonLabel from "./ButtonLabel";
import { buttonIconSizeMap, ButtonSize, IconPosition } from "./common";

export type ButtonInnerProps = {
  label: string;
  icon?: IconName;
  iconPosition: IconPosition;
  size: ButtonSize;
};
const ButtonInner: FC<ButtonInnerProps> = (props) => {
  const { iconPosition, size, icon, label } = props;
  return (
    <>
      {icon && (
        <ButtonIconWrapper iconPosition={iconPosition}>
          <Icon name={icon} size={buttonIconSizeMap[size]} />
        </ButtonIconWrapper>
      )}
      <ButtonLabel>{label}</ButtonLabel>
    </>
  );
};

export default ButtonInner;
