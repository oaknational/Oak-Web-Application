import { FC, forwardRef } from "react";
import styled from "styled-components";

import getColorByLocation from "../../styles/themeHelpers/getColorByLocation";
import getFontFamily from "../../styles/themeHelpers/getFontFamily";
import { getBreakpoint } from "../../styles/utils/responsive";
import { margin, MarginProps } from "../../styles/utils/spacing";
import Flex from "../Flex";
import { IconName } from "../Icon";
import BoxBorders from "../SpriteSheet/BrushSvgs/BoxBorders";
import Label from "../Typography/Label";
import UnstyledInput, { UnstyledInputProps } from "../UnstyledInput";
import { OakColorName } from "../../styles/theme/types";
import getColorByName from "../../styles/themeHelpers/getColorByName";
import { zIndexMap } from "../../styles/utils/zIndex";
import Svg from "../Svg";
import FieldError from "../FormFields/FieldError";

import InputIcon from "./InputIcon";

export type StyledInputProps = MarginProps & {
  value?: string;
  icon?: IconName;
};

export const InputFocusUnderline = styled(Svg)`
  display: none;
  position: absolute;
  bottom: -4px;
  left: -2px;
  right: 0;
  height: 4px;
  color: ${getColorByName("teachersYellow")};
  filter: drop-shadow(2px 2px 0 rgb(0 0 0));
  z-index: ${zIndexMap.inFront};
`;

export const RotatedInputLabel = styled(Label)<{
  background: OakColorName;
  color: OakColorName;
}>`
  position: relative;
  padding: 2px 10px;
  transform: rotate(-2deg) translateY(-8px) translateX(6px);
  display: block;
  background: ${(props) => getColorByName(props.background)};
  color: ${(props) => getColorByName(props.color)};
`;

export const InputFieldWrap = styled(Flex)`
  &:focus-within ${RotatedInputLabel} {
    background: ${getColorByName("teachersHighlight")};
    color: ${getColorByName("white")};
  }

  &:focus-within ${InputFocusUnderline} {
    display: inline;
  }
`;

export const StyledInput = styled(UnstyledInput)<StyledInputProps>`
  color: ${getColorByLocation(({ theme }) => theme.input.states.default.text)};
  height: ${(props) => props.theme.input.height};
  border-radius: ${(props) => props.theme.input.borderRadius};
  border-color: ${getColorByLocation(
    ({ theme }) => theme.input.states.default.border
  )};
  border-width: ${(props) => props.theme.input.borderWidth};
  padding-left: ${(props) => (props.icon ? "40px" : "12px")};
  padding-right: 12px;
  font-size: 16px;
  font-family: ${getFontFamily("ui")};
  font-weight: 300;
  width: 100%;
  margin-top: 10px;
  outline: none;

  @media (max-width: ${getBreakpoint("small")}px) {
    /* iOS zooms in on inputs with font sizes <16px on mobile */
    font-size: 16px;
  }

  ::placeholder {
    font-size: 14px;
    font-family: ${getFontFamily("ui")};
    color: ${getColorByLocation(
      ({ theme }) => theme.input.states.default.placeholder
    )};
    opacity: 1;
  }

  :valid:not([value=""]) {
    border-color: ${getColorByLocation(
      ({ theme }) => theme.input.states.valid.border
    )};

    ::placeholder {
      font-size: 14px;
      color: ${getColorByLocation(
        ({ theme }) => theme.input.states.valid.placeholder
      )};
    }

    ~ ${InputIcon} {
      color: ${getColorByLocation(
        ({ theme }) => theme.input.states.valid.icon
      )};
    }
  }

  ${margin}

  ~ ${InputIcon} {
    color: ${getColorByLocation(
      ({ theme }) => theme.input.states.default.icon
    )};
  }
`;

type InputProps = UnstyledInputProps &
  StyledInputProps & {
    id: string;
    label: string;
    error?: string;
  };
const Input: FC<InputProps> = forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    const { id, icon, label, error, ...inputProps } = props;
    const errorId = `${id}-error`;
    const labelId = `${id}-label`;

    return (
      <>
        <InputFieldWrap
          $mb={error ? 0 : 32}
          $alignItems="center"
          $background="white"
        >
          <Flex $width={"100%"} $position={"relative"}>
            <BoxBorders gapPosition="rightTop" />
            <Flex $position={"absolute"}>
              <RotatedInputLabel
                aria-hidden="true"
                background={error ? "failure" : "pastelTurquoise"}
                color={error ? "white" : "black"}
                htmlFor={id}
                id={labelId}
                $font={"body-3"}
              >
                {label}
              </RotatedInputLabel>
            </Flex>

            <StyledInput
              {...inputProps}
              icon={icon}
              ref={ref}
              id={id}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? errorId : undefined}
              aria-labelledby={labelId}
            />
            {icon && <InputIcon $pa={8} size={40} name={icon} />}
            <InputFocusUnderline aria-hidden="true" name={"underline-1"} />
          </Flex>
        </InputFieldWrap>
        <FieldError id={errorId}>{error}</FieldError>
      </>
    );
  }
);

export default Input;
