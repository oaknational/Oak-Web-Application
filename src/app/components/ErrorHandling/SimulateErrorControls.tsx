"use client";

import {
  OakAllSpacingToken,
  OakBox,
  OakSecondaryButton,
} from "@oaknational/oak-components";
import { useState } from "react";

export type ErrorBoundaryLevel = "global" | "root" | "core";
const getBottomSpacing = (level: ErrorBoundaryLevel): OakAllSpacingToken => {
  if (level === "core") {
    return "spacing-120";
  }
  if (level === "root") {
    return "spacing-64";
  }

  return "spacing-12";
};

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

  if (!simulateErrorControlsEnabled) {
    return null;
  }

  if (isError) {
    return <MockError />;
  }

  return (
    <OakBox
      $position="fixed"
      $left="spacing-48"
      $zIndex="in-front"
      $bottom={getBottomSpacing(errorBoundaryLevel)}
    >
      <OakSecondaryButton
        onClick={() => {
          setIsError(true);
        }}
        iconName="warning"
      >
        Simulate {errorBoundaryLevel} error
      </OakSecondaryButton>
    </OakBox>
  );
};

const MockError = () => {
  throw new Error("Mock error");
};
