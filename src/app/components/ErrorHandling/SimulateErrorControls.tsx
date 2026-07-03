"use client";

import { OakBox, OakSecondaryButton } from "@oaknational/oak-components";
import { useState } from "react";

/**
 * A component to aid with debugging error pages
 * Adds a button to the bottom left of the page which toggles the page into an error state
 */

export const SimulateErrorControls = () => {
  const [isError, setIsError] = useState(false);

  if (isError) {
    return <MockError />;
  }

  return (
    <OakBox
      $position="fixed"
      $bottom="spacing-24"
      $left="spacing-48"
      $zIndex="in-front"
    >
      <OakSecondaryButton
        onClick={() => {
          console.log("diego setting error");
          setIsError(true);
        }}
        iconName="warning"
      >
        Simulate error
      </OakSecondaryButton>
    </OakBox>
  );
};

const MockError = () => {
  throw new Error("Mock error");
  return <h1>Whoops</h1>;
};
