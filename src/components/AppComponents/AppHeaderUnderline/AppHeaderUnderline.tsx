import { FC } from "react";
import { OakBox, OakSvg } from "@oaknational/oak-components";

export const AppHeaderUnderline: FC = () => {
  return (
    <OakBox
      $position={"absolute"}
      $zIndex={"behind"}
      $height={"all-spacing-1"}
      $width={"100%"}
      $top={["all-spacing-10", "all-spacing-12"]}
      $right={"all-spacing-0"}
      $left={"all-spacing-0"}
    >
      <OakSvg
        name="header-underline"
        $position={"absolute"}
        $left={"all-spacing-0"}
        $top={"all-spacing-0"}
      />
    </OakBox>
  );
};
