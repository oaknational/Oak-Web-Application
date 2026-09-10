import { OakFlexProps, OakFlex } from "@oaknational/oak-components";
import { FC } from "react";

const Cover: FC<OakFlexProps> = (props) => {
  return (
    <OakFlex
      $position="absolute"
      $top={"spacing-0"}
      $right={"spacing-0"}
      $bottom={"spacing-0"}
      $left={"spacing-0"}
      {...props}
    />
  );
};

export default Cover;
