import { FC } from "react";

import { OakColorName } from "../../styles/theme/types";
import Flex from "../Flex";
import OutlineHeading from "../OutlineHeading/OutlineHeading";

export type ListItemIndexDesktopProps = {
  index: number;
  background: OakColorName;
  expired?: boolean;
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
    >
      <OutlineHeading tag={"h3"} $fontSize={32} lightShadow={expired}>
        {index.toString()}
      </OutlineHeading>
    </Flex>
  );
};

export default ListItemIndexDesktop;
