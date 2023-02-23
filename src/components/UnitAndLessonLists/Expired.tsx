import { FC } from "react";

import ButtonAsLink from "../Button/ButtonAsLink";
import Flex from "../Flex";
import { Span } from "../Typography";

export type ExpiredProps = {
  page: "lesson" | "unit";
};

const Expired: FC<ExpiredProps> = (props) => {
  const { page } = props;

  return (
    <Flex $flexDirection={"column"}>
      <Span $mb={18} $color={"oakGrey5"} $font={["body-3", "body-2"]}>
        {`Unfortunately this ${page} is now unavailable.`}
      </Span>
      <Flex>
        <ButtonAsLink
          icon={"ArrowRight"}
          $iconPosition={"trailing"}
          page={"help-home"}
          label={"Find out why"}
          variant="minimal"
          iconBackground={"black"}
        />
      </Flex>
    </Flex>
  );
};

export default Expired;
