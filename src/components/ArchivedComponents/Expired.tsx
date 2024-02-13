import { FC } from "react";
import { OakSpan } from "@oaknational/oak-components";

import Flex from "@/components/SharedComponents/Flex";

export type ExpiredProps = {
  page: "lesson" | "unit";
};

const Expired: FC<ExpiredProps> = (props) => {
  const { page } = props;

  return (
    <Flex $alignItems={"center"}>
      <OakSpan
        $mr={["space-between-none", "space-between-m"]}
        $color={"grey70"}
        $font={["body-3", "body-2"]}
      >
        {`Unfortunately this ${page} is now unavailable.`}
      </OakSpan>
    </Flex>
  );
};

export default Expired;
