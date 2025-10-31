import { FC, ReactNode } from "react";
import { OakFlex, OakFlexProps } from "@oaknational/oak-components";
import styled from "styled-components";

export type DelayedLoadingContainerProps = {
  delay?: number;
  children?: ReactNode;
  "data-testid"?: string;
} & Omit<OakFlexProps, "children">;

const StyledContainer = styled(OakFlex)<{
  $delay?: number;
}>`
  ${({ $delay }) => {
    if ($delay) {
      return `
        opacity: 0;
        animation: delayed-container-show 0s;
        animation-delay: ${$delay / 1000}s;
        animation-fill-mode: forwards;
      `;
    }
  }}

  @keyframes delayed-container-show {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const DelayedLoadingContainer: FC<DelayedLoadingContainerProps> = ({
  delay = 300,
  children,
  "data-testid": dataTestId = "delayed-loading-container",
  ...flexProps
}) => {
  return (
    <StyledContainer $delay={delay} data-testid={dataTestId} {...flexProps}>
      {children}
    </StyledContainer>
  );
};

export default DelayedLoadingContainer;
