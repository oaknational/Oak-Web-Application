import { FC } from "react";

import Box from "../Box/Box";
import Flex from "../Flex/Flex";
import Typography from "../Typography/Typography";
import ButtonAsLink from "../Button/ButtonAsLink";
import { Hr } from "../Typography";

import Tag from "@/components/TagPromotional";

const HomePageBanner: FC = () => {
  return (
    <Box $ph={16}>
      <Hr $color={"oakGreen"} thickness={4} $mt={0} $mb={0} />
      <Flex
        $justifyContent={["center", "space-between"]}
        $alignItems={"center"}
        $pv={24}
      >
        <Flex $alignItems={"center"} $gap={16} $display={["none", "flex"]}>
          <Tag />
          <Typography $font={"heading-7"}>
            Interactive curriculum plans
          </Typography>
        </Flex>
        <ButtonAsLink
          label={"View curriculum plans"}
          variant={"brushNav"}
          page={"curriculum-landing-page"}
          icon={"arrow-right"}
          $iconPosition={"trailing"}
          iconBackground="black"
          size={"small"}
        />
      </Flex>
      <Hr $color={"mint"} thickness={4} $mb={0} $mt={0} />
    </Box>
  );
};

export default HomePageBanner;
