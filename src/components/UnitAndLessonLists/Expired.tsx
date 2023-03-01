import { FC } from "react";

import Flex from "../Flex";
import { Span } from "../Typography";

export type ExpiredProps = {
  page: "lesson" | "unit";
};

const Expired: FC<ExpiredProps> = (props) => {
  const { page } = props;

  return (
    <Flex $alignItems={"center"}>
      <Span $mr={[0, 24]} $color={"oakGrey5"} $font={["body-3", "body-2"]}>
        {`Unfortunately this ${page} is now unavailable.`}
      </Span>
    </Flex>
  );
};

export default Expired;
