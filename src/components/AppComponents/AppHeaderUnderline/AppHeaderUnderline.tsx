import { FC } from "react";
import { OakBox, OakSvg } from "@oaknational/oak-components";

export const AppHeaderUnderline: FC = () => {
  return (
    <OakBox
      $position={"absolute"}
      $zIndex={"behind"}
      $height={"spacing-4"}
      $width={"100%"}
      $top={["spacing-56", "spacing-72"]}
      $right={"spacing-0"}
      $left={"spacing-0"}
    >
      <OakSvg
        name="header-underline"
        $position={"absolute"}
        $left={"spacing-0"}
        $top={"spacing-0"}
      />
    </OakBox>
  );
};
