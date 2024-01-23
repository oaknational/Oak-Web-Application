import { FC } from "react";

import { Span } from "@/components/SharedComponents/Typography";
import Flex from "@/components/SharedComponents/Flex";

export type ExpiredProps = {
  page: "lesson" | "unit";
};

const Expired: FC<ExpiredProps> = (props) => {
  const { page } = props;

  return (
    <Flex $alignItems={"center"}>
      <Span $mr={[0, 24]} $color={"grey70"} $font={["body-3", "body-2"]}>
        {`Unfortunately this ${page} is now unavailable.`}
      </Span>
    </Flex>
  );
};

export default Expired;
