"use client";

import { OakFlex, OakLoadingSpinner } from "@oaknational/oak-components";

export default function Loading() {
  return (
    <OakFlex $justifyContent={"center"} $alignItems={"center"}>
      <OakLoadingSpinner $width={"all-spacing-15"} $color={"oakGreen"} />
    </OakFlex>
  );
}
