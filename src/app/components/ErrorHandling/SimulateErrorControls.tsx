"use client";

import { OakBox, OakSecondaryButton } from "@oaknational/oak-components";
import { useState } from "react";
import styled from "styled-components";

import getBrowserConfig from "@/browser-lib/getBrowserConfig";

export type ErrorBoundaryLevel = "global" | "root" | "core";

const getBottomSpacing = (level: ErrorBoundaryLevel): number => {
  if (level === "core") {
    return 144;
  }
  if (level === "root") {
    return 84;
  }
  return 24;
};

const StyledBox = styled(OakBox)<{ level: ErrorBoundaryLevel }>`
  position: fixed;
  left: 48px;
  bottom: ${(props) => getBottomSpacing(props.level)}px;
`;

/**
 * A component to aid with debugging error pages
 * Adds a button to the bottom left of the page which toggles the page into an error state
 */

export const SimulateErrorControls = ({
  errorBoundaryLevel,
}: {
  errorBoundaryLevel: ErrorBoundaryLevel;
}) => {
  const [isError, setIsError] = useState(false);

  const simulateErrorControlsEnabled =
    process.env.NEXT_PUBLIC_SIMULATE_ERROR === "true";

  const isDevelopmentBuild = getBrowserConfig("releaseStage") === "development";

  if (!simulateErrorControlsEnabled || !isDevelopmentBuild) {
    return null;
  }

  if (isError) {
    return <MockError />;
  }

  return (
    <StyledBox $zIndex="in-front" level={errorBoundaryLevel}>
      <OakSecondaryButton onClick={() => setIsError(true)} iconName="warning">
        Simulate {errorBoundaryLevel} error
      </OakSecondaryButton>
    </StyledBox>
  );
};

const MockError = () => {
  throw new Error("Mock error");
};
