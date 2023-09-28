import { FC } from "react";

import Box from "../Box/Box";
import MaxWidth from "../MaxWidth/MaxWidth";
import Flex from "../Flex/Flex";
import Typography from "../Typography/Typography";
import ButtonAsLink from "../Button/ButtonAsLink";
import { Hr } from "../Typography";

import Tag from "@/components/TagPromotional";

const HomePageBanner: FC = () => {
  return (
    <Box>
      <Hr $color={"oakGreen"} $height={4} $mt={0} />
      <MaxWidth>
        <Flex $justifyContent={"space-between"} $alignItems={"center"}>
          <Flex $alignItems={"center"} $gap={16}>
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
          />
        </Flex>
      </MaxWidth>
      <Hr $color={"mint"} $height={4} $mb={0} />
    </Box>
  );
};

export default HomePageBanner;
