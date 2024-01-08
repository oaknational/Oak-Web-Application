import { FC } from "react";

import { OakColorName } from "@/styles/theme/types";
import OutlineHeading from "@/components/SharedComponents/OutlineHeading/OutlineHeading";
import Flex from "@/components/SharedComponents/Flex";

export type ListItemIndexDesktopProps = {
  index: number;
  background: OakColorName;
  expired?: boolean | null;
};

const ListItemIndexDesktop: FC<ListItemIndexDesktopProps> = (props) => {
  const { background, index, expired } = props;

  return (
    <Flex
      $justifyContent={"center"}
      $display={["none", "flex"]}
      $alignItems={"center"}
      $minWidth={80}
      $height={"100%"}
      $background={background}
      $position={"relative"}
      $transition={"all 0.4s ease-out"}
      data-testid="list-item-index-container"
    >
      <OutlineHeading
        tag={"div"}
        $fontSize={32}
        $lightShadow={expired}
        ariaHidden={true}
      >
        {index.toString()}
      </OutlineHeading>
    </Flex>
  );
};

export default ListItemIndexDesktop;
