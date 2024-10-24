import { FC } from "react";
import { OakTypography } from "@oaknational/oak-components";

import { OakColorName } from "@/styles/theme";
import ScreenReaderOnly from "@/components/SharedComponents/ScreenReaderOnly/";
import { Hr } from "@/components/SharedComponents/Typography";
import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";
import Flex from "@/components/SharedComponents/Flex.deprecated";
import Box from "@/components/SharedComponents/Box";
import Tag from "@/components/SharedComponents/TagPromotional";
import { ResolveOakHrefProps } from "@/common-lib/urls";

export type HomePageBannerProps = {
  background: OakColorName;
  newText: string;
  ctaText: string;
} & ResolveOakHrefProps;

const HomePageBanner: FC<HomePageBannerProps> = ({
  background,
  newText,
  ctaText,
  ...linkProps
}) => (
  <Box role="banner">
    <Flex
      $background={background}
      $justifyContent={["center"]}
      $alignItems={"center"}
      $pv={8}
      $ph={[8, 10]}
    >
      <Flex
        $alignItems={"center"}
        $flexWrap={"wrap"}
        $gap={[4, 40]}
        $flexDirection={["column", "row"]}
        $justifyContent={"center"}
        $pv={0}
      >
        <Flex $alignItems={"center"} $gap={[0, 4]} $minWidth={["fit-content"]}>
          <Tag aria-hidden="true" size={"small"} />
          <OakTypography $font={["body-3", "body-2"]}>
            <ScreenReaderOnly>New&nbsp;</ScreenReaderOnly> {newText}
          </OakTypography>
        </Flex>
        <ButtonAsLink
          $ml={[20, 0]}
          {...linkProps}
          label={ctaText}
          variant={"buttonStyledAsLink"}
          icon={"chevron-right"}
          $iconPosition={"trailing"}
          iconBackground="lemon"
          size={"medium"}
          $mh={0}
        />
      </Flex>
    </Flex>
    <Hr $color={"black"} $background={"lemon"} thickness={4} $mb={0} $mt={0} />
  </Box>
);

export default HomePageBanner;
