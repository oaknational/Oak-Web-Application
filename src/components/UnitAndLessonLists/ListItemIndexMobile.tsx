import { FC } from "react";

import { OakColorName } from "../../styles/theme/types";
import Flex from "../Flex";
import OutlineHeading from "../OutlineHeading";

export type ListItemIndexMobileProps = {
  background: OakColorName;
  index: number;
  expired?: boolean;
};

const ListItemIndexMobile: FC<ListItemIndexMobileProps> = (props) => {
  const { background, index, expired } = props;

  return (
    <Flex
      $justifyContent={"center"}
      $display={["flex", "none"]}
      $alignItems={"center"}
      $minWidth={[64, 72]}
      $minHeight={[64, 72]}
      $height={"100%"}
      $background={background}
      $position={"relative"}
    >
      <OutlineHeading tag={"li"} $fontSize={24} $lightShadow={expired}>
        {index.toString()}
      </OutlineHeading>
    </Flex>
  );
};

export default ListItemIndexMobile;
