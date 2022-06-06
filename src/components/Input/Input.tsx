import { FC } from "react";
import styled from "styled-components";

import getColor from "../../styles/themeHelpers/getColor";
import getFontFamily from "../../styles/themeHelpers/getFontFamily";
import { getBreakpoint } from "../../styles/utils/responsive";
import { margin, MarginProps } from "../../styles/utils/spacing";
import Flex from "../Flex";
import { IconName } from "../Icon";
import UnstyledInput, { UnstyledInputProps } from "../UnstyledInput";

import InputIcon from "./InputIcon";

type StyledInputProps = MarginProps & {
  value: string;
  icon?: IconName;
};
const StyledInput = styled(UnstyledInput)<StyledInputProps>`
  color: ${getColor("black")};
  height: ${(props) => props.theme.input.height};
  border-radius: ${(props) => props.theme.input.borderRadius};
  border-color: ${getColor((theme) => theme.palette.input.default.border)};
  border-width: ${(props) => props.theme.input.borderWidth};
  border-style: solid;
  padding-left: ${(props) => (props.icon ? "40px" : "12px")};
  padding-right: 0;
  font-size: 16px;
  font-family: ${getFontFamily("ui")};
  font-weight: 400;
  width: 100%;

  @media (max-width: ${getBreakpoint("small")}px) {
    /* iOS zooms in on inputs with font sizes <16px on mobile */
    font-size: 16px;
  }

  ::placeholder {
    font-family: ${getFontFamily("ui")};
    color: ${getColor((props) => props.palette.input.default.placeholder)};
    opacity: 1;
  }

  :valid:not([value=""]) {
    border-color: ${getColor((props) => props.palette.input.valid.border)};

    ::placeholder {
      color: ${getColor((props) => props.palette.input.valid.placeholder)};
    }

    ~ ${InputIcon} {
      color: ${getColor((theme) => theme.palette.input.valid.icon)};
    }
  }

  ${margin}

  ~ ${InputIcon} {
    color: ${getColor((theme) => theme.palette.input.default.icon)};
  }
`;

type InputProps = UnstyledInputProps & StyledInputProps;
const Input: FC<InputProps> = (props) => {
  const { icon } = props;

  return (
    <Flex alignItems="center">
      <StyledInput {...props} />
      {icon && <InputIcon outerWidth={40} size={20} name={icon} />}
    </Flex>
  );
};

export default Input;
