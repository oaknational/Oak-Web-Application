import { FC } from "react";

import { OakColorName } from "../../styles/theme/types";
import Flex from "../Flex";
import OutlineHeading from "../OutlineHeading";

export type ListItemIndexMobileProps = {
  background: OakColorName;
  index: number;
};

const ListItemIndexMobile: FC<ListItemIndexMobileProps> = (props) => {
  const { background, index } = props;

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
      <OutlineHeading tag={"h3"} $fontSize={[32, 24]}>
        {index.toString()}
      </OutlineHeading>
    </Flex>
  );
};

export default ListItemIndexMobile;
