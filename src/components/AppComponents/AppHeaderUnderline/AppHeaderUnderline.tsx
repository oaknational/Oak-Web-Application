import { FC } from "react";
import { OakIcon, OakBox } from "@oaknational/oak-components";

export const AppHeaderUnderline: FC = () => {
  return (
    <OakBox
      $position={"absolute"}
      $zIndex={"behind"}
      $height={"all-spacing-1"}
      $top={"all-spacing-12"}
      $right={"all-spacing-0"}
      $left={"all-spacing-0"}
    >
      <OakIcon
        iconName="header-underline"
        $width={"100%"}
        $height={"100%"}
        $objectFit={"fill"}
      />
    </OakBox>
  );
};
