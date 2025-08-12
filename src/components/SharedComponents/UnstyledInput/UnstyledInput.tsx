import { DetailedHTMLProps, InputHTMLAttributes } from "react";
import styled from "styled-components";

import getColorByLocation from "@/styles/themeHelpers/getColorByLocation";

export type UnstyledInputProps = Omit<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  "ref"
>;
/**
 * Using `appearance none !important;` here because many style resets will set this
 * value to textfield, causing some browsers to implement undesirable styles.
 * E.g. ios and rounded borders (which border-radius doesn't fix without
 * appearance: none)
 */
const UnstyledInput = styled.input`
  appearance: none;
  border: 0;
  border-radius: 0;
  border-color: transparent;
  box-shadow: none;
  font-family: ${(props) => props.theme.fonts.ui};

  &::placeholder {
    color: ${getColorByLocation(
      ({ theme }) => theme.input.states.default.placeholder,
    )};
  }

  &::-webkit-search-decoration,
  &::-webkit-search-cancel-button,
  &::-webkit-search-results-button,
  &::-webkit-search-results-decoration {
    appearance: none;
  }
`;

export default UnstyledInput;
