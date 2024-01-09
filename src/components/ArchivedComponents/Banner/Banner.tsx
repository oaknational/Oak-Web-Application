import { ReactNode } from "react";

import Typography, { Hr } from "@/components/SharedComponents/Typography";
import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";
import Flex from "@/components/SharedComponents/Flex";
import Box from "@/components/SharedComponents/Box";
import Tag from "@/components/TagPromotional";

const HomePageBanner: ReactNode = (
  <Box>
    <Hr $color={"oakGreen"} thickness={8} $mt={-4} $mb={0} />
    <Flex
      $justifyContent={["center", "space-between"]}
      $alignItems={"center"}
      $pv={16}
      $ph={16}
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
        size={"xs"}
      />
    </Flex>
    <Hr $color={"mint"} thickness={4} $mb={0} $mt={0} />
  </Box>
);

export default HomePageBanner;
