import { FC, forwardRef } from "react";
import styled from "styled-components";

import getColorByLocation from "../../styles/themeHelpers/getColorByLocation";
import getFontFamily from "../../styles/themeHelpers/getFontFamily";
import { getBreakpoint } from "../../styles/utils/responsive";
import { margin, MarginProps } from "../../styles/utils/spacing";
import Box from "../Box";
import Flex from "../Flex";
import { IconName } from "../Icon";
import { Span } from "../Typography";
import Label from "../Typography/Label";
import UnstyledInput, { UnstyledInputProps } from "../UnstyledInput";

import InputIcon from "./InputIcon";

const LabelWrapper = styled(Box)`
  transform: translateY(-100%);
`;

type StyledInputProps = MarginProps & {
  value?: string;
  icon?: IconName;
};
const StyledInput = styled(UnstyledInput)<StyledInputProps>`
  color: ${getColorByLocation(({ theme }) => theme.input.states.default.text)};
  height: ${(props) => props.theme.input.height};
  border-radius: ${(props) => props.theme.input.borderRadius};
  border-color: ${getColorByLocation(
    ({ theme }) => theme.input.states.default.border
  )};
  border-width: ${(props) => props.theme.input.borderWidth};
  border-style: solid;
  padding-left: ${(props) => (props.icon ? "40px" : "12px")};
  padding-right: 0;
  font-size: 16px;
  font-family: ${getFontFamily("ui")};
  font-weight: 300;
  width: 100%;

  @media (max-width: ${getBreakpoint("small")}px) {
    /* iOS zooms in on inputs with font sizes <16px on mobile */
    font-size: 16px;
  }

  ::placeholder {
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
    label?: string;
    error?: string;
  };
const Input: FC<InputProps> = forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    const { id, icon, label, error, ...inputProps } = props;
    const errorId = `${id}-error`;

    return (
      <>
        {label && (
          <LabelWrapper $position="absolute">
            <Label $fontSize={12} htmlFor={id}>
              {label}
            </Label>
          </LabelWrapper>
        )}
        <Flex $alignItems="center">
          <StyledInput
            {...inputProps}
            icon={icon}
            ref={ref}
            id={id}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
          />
          {icon && <InputIcon $pa={8} size={40} name={icon} />}
        </Flex>
        {error && (
          <Box $position="absolute">
            <Span $color="failure" $fontSize={12} id={errorId}>
              {error}
            </Span>
          </Box>
        )}
      </>
    );
  }
);

export default Input;
