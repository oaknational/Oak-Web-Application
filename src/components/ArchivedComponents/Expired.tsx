import { FC } from "react";
import { OakSpan, OakFlex } from "@oaknational/oak-components";

export type ExpiredProps = {
  page: "lesson" | "unit";
};

const Expired: FC<ExpiredProps> = (props) => {
  const { page } = props;

  return (
    <OakFlex $alignItems={"center"}>
      <OakSpan
        $mr={["space-between-none", "space-between-m"]}
        $color={"grey70"}
        $font={["body-3", "body-2"]}
      >
        {`Unfortunately this ${page} is now unavailable.`}
      </OakSpan>
    </OakFlex>
  );
};

export default Expired;
