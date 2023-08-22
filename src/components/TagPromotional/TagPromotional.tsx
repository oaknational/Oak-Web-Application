import { FC } from "react";

import Flex from "../Flex";
import Svg from "../Svg";
import { Span } from "../Typography";

const TagPromotional: FC = () => {
  return (
    <Flex $zIndex={"inFront"} $height={[18, 50]} $position={"relative"}>
      <Svg
        $width={56}
        $color={"oakGrey6"}
        $position={"absolute"}
        name={"tag-promotional"}
        $bottom={1}
      />
      <Flex $left={[14, 8]} $top={[-2, 12]} $position={"absolute"}>
        <Span $color={"white"} $font={["body-4", "heading-7"]}>
          New
        </Span>
      </Flex>
    </Flex>
  );
};

export default TagPromotional;
