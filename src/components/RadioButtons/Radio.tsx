import { FC, useContext, useId, useRef } from "react";
import {
  useFocusRing,
  useRadio,
  VisuallyHidden,
  AriaRadioProps,
} from "react-aria";
import { RadioGroupState } from "react-stately";
import styled, { css } from "styled-components";

import getColorByName from "../../styles/themeHelpers/getColorByName";

import { RadioContext } from "./RadioGroup";

const Radio: FC<AriaRadioProps> = (props) => {
  const { children } = props;
  const stateOrNull = useContext(RadioContext);
  const state = stateOrNull as RadioGroupState;
  const ref = useRef(null);
  const { inputProps, isSelected, isDisabled } = useRadio(props, state, ref);
  const { isFocusVisible, focusProps } = useFocusRing();

  inputProps.name = useId();
  inputProps.id = useId();

  const StyledRadio = styled.span<{
    isSelected: boolean;
    isFocusVisible: boolean;
    hasError?: boolean;
  }>`
    height: 24px;
    width: 24px;
    border: 2px solid
      ${(props) =>
        props.isFocusVisible
          ? getColorByName("black")
          : getColorByName("oakGrey3")};
    ${(props) =>
      props.hasError &&
      css`
        border: 2px solid ${getColorByName("failure")};
      `}
    border-radius: 50%;
    display: flex;
    flex-grow: 0;
    flex-shrink: 0;
    align-items: center;
    background: white;
    justify-content: center;
    cursor: pointer;
    margin-right: 16px;
    ${(props) =>
      props.isFocusVisible &&
      css`
        box-shadow: 0 0 0 2px ${getColorByName("teachersYellow")};
      `}

    &::after {
      content: "";
      height: ${(props) => (props.isSelected ? "20px" : "16px")};
      width: ${(props) => (props.isSelected ? "20px" : "16px")};
      background: ${(props) =>
        props.isSelected
          ? getColorByName("teachersHighlight")
          : getColorByName("white")};
      display: block;
      position: absolute;
      border-radius: 50%;
    }

    &:active {
      border: 2px solid ${getColorByName("black")};
      box-shadow: 0 0 0 3px ${getColorByName("teachersYellow")};
    }

    &:hover {
      &::after {
        background: ${getColorByName("teachersHighlight")};
      }
    }

    &:focus {
      border: 2px solid ${getColorByName("black")};
      box-shadow: 0 0 0 3px ${getColorByName("teachersYellow")};
    }
  `;

  return (
    <label
      aria-describedby={undefined}
      style={{
        display: "flex",
        alignItems: "center",
        marginBottom: "12px",
        opacity: isDisabled ? 0.4 : 1,
      }}
    >
      <VisuallyHidden>
        <input
          {...inputProps}
          {...focusProps}
          ref={ref}
          aria-describedby={undefined}
        />
      </VisuallyHidden>

      <StyledRadio
        isSelected={isSelected}
        isFocusVisible={isFocusVisible}
        aria-describedby={undefined}
        hasError={state.validationState === "invalid"}
      />

      {children}
    </label>
  );
};

export default Radio;
