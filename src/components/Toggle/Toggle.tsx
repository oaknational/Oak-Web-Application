import React, { FC } from "react";
import styled from "styled-components";

import Flex from "../Flex";
import P from "../Typography/P";
import getColorByLocation from "../../styles/themeHelpers/getColorByLocation";
import { OakColorName } from "../../styles/theme/types";

export type ToggleStyleConfig = {
  on: {
    labelColor: OakColorName;
    background: OakColorName;
    switchColor: OakColorName;
  };
  off: {
    labelColor: OakColorName;
    background: OakColorName;
    switchColor: OakColorName;
  };
  disabled: {
    labelColor: OakColorName;
    background: OakColorName;
    switchColor: OakColorName;
  };
};

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
  background-color: ${getColorByLocation(
    ({ theme }) => theme.toggle.off.background
  )};
  transition: 0.4s;
  border-radius: 16px;

  &::before {
    content: "";
    position: absolute;
    width: 16px;
    height: 16px;
    transform: ${(props) =>
      props.disabled ? "translateX(16px)" : "translateX(4px)"};
    bottom: 8px;
    background-color: ${(props) =>
      props.disabled
        ? getColorByLocation(({ theme }) => theme.toggle.disabled.switchColor)
        : getColorByLocation(({ theme }) => theme.toggle.on.switchColor)};
    transition: 0.4s;
    border-radius: 50%;
  }
`;
const ToggleSwitch = styled.div`
  position: relative;
  display: inline-block;
  width: 48px;
  height: 32px;
  vertical-align: top;

  ${SwitchInput}:checked + ${SwitchSlider} {
    background-color: ${getColorByLocation(
      ({ theme }) => theme.toggle.on.background
    )};
  }

  ${SwitchInput}:checked + ${SwitchSlider}::before {
    transform: translateX(28px);
  }
`;

const LabelText = styled(P)<Pick<ToggleProps, "checked" | "disabled">>`
  color: ${(props) =>
    props.checked &&
    getColorByLocation(({ theme }) => theme.toggle.on.labelColor)};
  /* stylelint-disable-next-line declaration-block-no-duplicate-properties */
  color: ${(props) =>
    !props.checked &&
    getColorByLocation(({ theme }) => theme.toggle.off.labelColor)};
  /* stylelint-disable-next-line declaration-block-no-duplicate-properties */
  color: ${(props) =>
    props.disabled &&
    getColorByLocation(({ theme }) => theme.toggle.disabled.labelColor)};
`;

type ToggleProps = {
  checked: boolean;
  disabled?: boolean;
  labelOn: string;
  labelOff: string;
  onChange: () => void;
};

const Toggle: FC<ToggleProps> = ({
  checked = false,
  labelOn,
  labelOff,
  disabled,
  onChange,
}) => {
  return (
    <label>
      <Flex $justifyContent={"center"}>
        <LabelText checked={!checked} disabled={disabled} $mt={4} $mr={8}>
          {labelOff}
        </LabelText>

        <ToggleSwitch>
          <SwitchInput
            data-testid="toggle"
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={onChange}
          />
          <SwitchSlider disabled={disabled} />
        </ToggleSwitch>

        <LabelText checked={checked} disabled={disabled} $mt={4} $ml={8}>
          {labelOn}
        </LabelText>
      </Flex>
    </label>
  );
};
export default Toggle;
