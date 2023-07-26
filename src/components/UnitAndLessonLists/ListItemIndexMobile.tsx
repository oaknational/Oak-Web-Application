import { FC } from "react";

import { OakColorName } from "../../styles/theme/types";
import Flex from "../Flex";
import OutlineHeading from "../OutlineHeading";

export type ListItemIndexMobileProps = {
  background: OakColorName;
  fromSearchPage?: boolean;
  index?: number;
};

const ListItemIndexMobile: FC<ListItemIndexMobileProps> = (props) => {
  const { background, index, fromSearchPage } = props;

  const indexString = index ? index.toString() : "";

  return (
    <Flex
      $justifyContent={"center"}
      $display={["flex", "none"]}
      $alignItems={"center"}
      $minHeight={72}
      $minWidth={72}
      $background={background}
      $position={"relative"}
      $ml={"auto"}
    >
      {!fromSearchPage && indexString && (
        <OutlineHeading tag={"h1"} $fontSize={32}>
          {indexString}
        </OutlineHeading>
      )}
    </Flex>
  );
};

export default ListItemIndexMobile;
