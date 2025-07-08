import { forwardRef } from "react";
import styled from "styled-components";
import { OakBox, OakFieldError, OakSpan } from "@oaknational/oak-components";

import InputIcon from "./InputIcon";

import getColorByLocation from "@/styles/themeHelpers/getColorByLocation";
import getFontFamily from "@/styles/themeHelpers/getFontFamily";
import { getBreakpoint } from "@/styles/utils/responsive";
import { margin, MarginProps } from "@/styles/utils/spacing";
import Flex from "@/components/SharedComponents/Flex.deprecated";
import { IconName } from "@/components/SharedComponents/Icon.deprecated";
import BoxBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BoxBorders";
import UnstyledInput, {
  UnstyledInputProps,
} from "@/components/SharedComponents/UnstyledInput";
import { OakColorName } from "@/styles/theme/types";
import getColorByName from "@/styles/themeHelpers/getColorByName";
import { zIndexMap } from "@/styles/utils/zIndex";
import Svg from "@/components/SharedComponents/Svg";
import Label from "@/components/SharedComponents/Typography/Label";

export type StyledInputProps = MarginProps & {
  value?: string;
  icon?: IconName;
  isOptional?: boolean;
  isRequired?: boolean;
};

export const InputFocusUnderline = styled(Svg)`
  display: none;
  position: absolute;
  bottom: -4px;
  left: -2px;
  right: 0;
  height: 4px;
  color: ${getColorByName("lemon")};
  filter: drop-shadow(2px 2px 0 rgb(0 0 0));
  z-index: ${zIndexMap.inFront};
`;

export const RotatedInputLabel = styled(Label)<{
  background: OakColorName;
  color: OakColorName;
}>`
  position: relative;
  padding: 4px 8px;
  transform: rotate(-2deg) translateY(-16px) translateX(8px);
  display: block;
  background: ${(props) => getColorByName(props.background)};
  color: ${(props) => getColorByName(props.color)};
`;

export const InputFieldWrap = styled(Flex)`
  &:focus-within ${RotatedInputLabel} {
    background: ${getColorByName("blue")};
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
    ({ theme }) => theme.input.states.default.border,
  )};
  border-width: ${(props) => props.theme.input.borderWidth};
  padding-left: ${(props) => (props.icon ? "40px" : "12px")};
  padding: 16px;
  padding-top: 20px;
  font-size: 16px;
  font-family: ${getFontFamily("ui")};
  font-weight: 300;
  width: 100%;
  outline: none;

  @media (max-width: ${getBreakpoint("small")}px) {
    /* iOS zooms in on inputs with font sizes <16px on mobile */
    font-size: 16px;
  }

  ::placeholder {
    font-size: ${(props) => props.theme.input.fontSize};
    font-weight: 300;
    font-family: ${getFontFamily("ui")};
    color: ${getColorByLocation(
      ({ theme }) => theme.input.states.default.placeholder,
    )};
    opacity: 1;
  }

  :valid:not([value=""]) {
    border-color: ${getColorByLocation(
      ({ theme }) => theme.input.states.valid.border,
    )};

    ::placeholder {
      font-size: ${(props) => props.theme.input.fontSize};
      color: ${getColorByLocation(
        ({ theme }) => theme.input.states.valid.placeholder,
      )};
    }

    ~ ${InputIcon} {
      color: ${getColorByLocation(
        ({ theme }) => theme.input.states.valid.icon,
      )};
    }
  }

  ${margin}

  ~ ${InputIcon} {
    color: ${getColorByLocation(
      ({ theme }) => theme.input.states.default.icon,
    )};
  }
`;

type InputProps = UnstyledInputProps &
  StyledInputProps & {
    id: string;
    label: string;
    error?: string;
    withoutMarginBottom?: boolean;
  };
const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const {
    id,
    icon,
    label,
    error,
    isOptional,
    isRequired,
    withoutMarginBottom,
    $mb,
    ...inputProps
  } = props;
  const errorId = `${id}-error`;
  const labelId = `${id}-label`;
  return (
    <>
      {error && (
        <OakBox
          id={errorId}
          $mb={withoutMarginBottom ? "space-between-none" : "space-between-m"}
          role="alert"
        >
          <OakFieldError>{error}</OakFieldError>
        </OakBox>
      )}
      <InputFieldWrap
        $mb={$mb ?? 32}
        $alignItems="center"
        $background="white"
        $width={"100%"}
      >
        <Flex $width={"100%"} $position={"relative"}>
          <BoxBorders gapPosition="rightTop" />
          <Flex $position={"absolute"}>
            <RotatedInputLabel
              aria-hidden="true"
              background={error ? "red" : "lemon"}
              color={error ? "white" : "black"}
              htmlFor={id}
              id={labelId}
              $font={"heading-7"}
              data-testid="rotated-input-label"
            >
              {isRequired && (
                <OakSpan>
                  {props.label}{" "}
                  <OakSpan $font={"heading-light-7"}>(required)</OakSpan>
                </OakSpan>
              )}
              {isOptional && (
                <OakSpan>
                  {props.label}{" "}
                  <OakSpan $font={"heading-light-7"}>(optional)</OakSpan>
                </OakSpan>
              )}
              {!isRequired && !isOptional && props.label}
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
    </>
  );
});

export default Input;
