import { FC } from "react";
import { OakColorToken, OakFlex } from "@oaknational/oak-components";

import OutlineHeading from "@/components/SharedComponents/OutlineHeading";

export type ListItemIndexMobileProps = {
  background: OakColorToken;
  index: number;
  expired?: boolean | null;
};

const ListItemIndexMobile: FC<ListItemIndexMobileProps> = (props) => {
  const { background, index, expired } = props;

  return (
    <OakFlex
      $justifyContent={"center"}
      $display={["flex", "none"]}
      $alignItems={"center"}
      $minWidth={["all-spacing-11", "all-spacing-12"]}
      $minHeight={["all-spacing-11", "all-spacing-12"]}
      $height={"100%"}
      $background={background}
      $position={"relative"}
    >
      <OutlineHeading
        tag={"div"}
        $fontSize={24}
        $lightShadow={expired}
        ariaHidden={true}
      >
        {index.toString()}
      </OutlineHeading>
    </OakFlex>
  );
};

export default ListItemIndexMobile;
