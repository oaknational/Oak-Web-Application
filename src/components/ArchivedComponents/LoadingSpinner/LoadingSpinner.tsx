import { FC } from "react";
import styled, { keyframes } from "styled-components";

import ScreenReaderOnly from "@/components/SharedComponents/ScreenReaderOnly";

const SpinnerKeyframe = keyframes`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`;
const StyledLoadingSpinner = styled.span`
  --width: 20px;
  --inner-width: calc(var(--width) / 10 * 8);
  --thickness: calc(var(--width) / 10);

  position: absolute;
  display: inline-flex;
  width: var(--width);
  height: var(--width);

  ::after {
    content: " ";
    display: block;
    width: var(--inner-width);
    height: var(--inner-width);
    margin: var(--thickness);
    border-radius: 50%;
    border: var(--thickness) solid currentcolor;
    border-color: currentcolor transparent;
    animation: ${SpinnerKeyframe} 1.2s linear infinite;
  }
`;

const LoadingSpinner: FC = () => {
  return (
    <StyledLoadingSpinner>
      <ScreenReaderOnly>Loading</ScreenReaderOnly>
    </StyledLoadingSpinner>
  );
};

export default LoadingSpinner;
