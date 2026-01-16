"use client";

import { OakFlex, OakLoadingSpinner } from "@oaknational/oak-components";

export default function Loading() {
  return (
    <OakFlex $justifyContent={"center"} $alignItems={"center"}>
      <OakLoadingSpinner $width={"spacing-100"} $color={"oakGreen"} />
    </OakFlex>
  );
}
