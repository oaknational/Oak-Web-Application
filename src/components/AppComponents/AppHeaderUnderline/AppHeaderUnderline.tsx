import { FC } from "react";
import { OakBox, OakIcon } from "@oaknational/oak-components";

export const AppHeaderUnderline: FC = () => {
  return (
    <OakBox
      $position={"absolute"}
      $zIndex={"behind"}
      $height={"all-spacing-1"}
      $width={"100%"}
      $top={"all-spacing-12"}
      $right={"all-spacing-0"}
      $left={"all-spacing-0"}
    >
      <OakIcon
        iconName="header-underline"
        $width={"100%"}
        $height={"100%"}
        $position={"absolute"}
        $left={"all-spacing-0"}
        $top={"all-spacing-0"}
        $objectFit={"fill"}
        height={"4"}
        width={"1000"}
      />
    </OakBox>
  );
};
