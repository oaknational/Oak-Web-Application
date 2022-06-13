import React, { FC } from "react";
import styled from "styled-components";

import getColor from "../../styles/themeHelpers/getColor";
import Flex from "../Flex";
import { Text } from "../Typography";

const SwitchInput = styled.input`
  opacity: 0.01;
`;

const SwitchSlider = styled.span<Pick<ToggleProps, "disabled">>`
  position: absolute;
  cursor: ${(props) => (props.disabled ? "default" : "pointer")};
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${getColor("white")};
  transition: 0.4s;
  border-radius: 16px;

  &::before {
    content: "";
    position: absolute;
    width: 16px;
    height: 16px;
    left: ${(props) => (props.disabled ? "16px" : "4px")};
    bottom: 8px;
    background-color: ${getColor("grey6")};
    background-color: ${(props) =>
      props.disabled ? getColor("grey6") : getColor("grey8")};
    transition: 0.4s;
    border-radius: 50%;
  }
`;
const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 32px;
  vertical-align: top;

  ${SwitchInput}:checked + ${SwitchSlider} {
    background-color: ${getColor("white")};
  }

  ${SwitchInput}:checked + ${SwitchSlider}::before {
    transform: translateX(22px);
  }
`;

const LabelOn = styled(Text)<Pick<ToggleProps, "checked" | "disabled">>`
  color: ${(props) =>
    props.checked && !props.disabled ? getColor("grey8") : getColor("grey10")};
`;

const LabelOff = styled(Text)<Pick<ToggleProps, "checked" | "disabled">>`
  color: ${(props) =>
    props.checked && !props.disabled ? getColor("grey10") : getColor("grey8")};
`;

type ToggleProps = {
  checked: boolean;
  disabled?: boolean;
  labelOn: string;
  labelOff: string;
  onChange: () => void;
};

//*Allow users to turn an single option on or off. They are usually used to activate or deactivate a specific setting. */

const Toggle: FC<ToggleProps> = ({
  checked = false,
  labelOn,
  labelOff,
  disabled,
  onChange,
}) => {
  return (
    <Flex justifyContent={"center"}>
      <LabelOn checked={checked} disabled={disabled} mt={3} mr={8}>
        {labelOn}
      </LabelOn>

      <ToggleSwitch>
        <SwitchInput
          data-testid="toggle"
          type="checkbox"
          checked={disabled ? false : checked}
          disabled={disabled}
          onChange={onChange}
        />
        <SwitchSlider disabled={disabled} />
      </ToggleSwitch>

      <LabelOff checked={checked} disabled={disabled} mt={3} ml={8}>
        {labelOff}
      </LabelOff>
    </Flex>
  );
};
export default Toggle;
