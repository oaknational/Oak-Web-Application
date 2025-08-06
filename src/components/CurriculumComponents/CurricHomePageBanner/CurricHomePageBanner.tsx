import { FC } from "react";
import {
  OakFlex,
  OakBox,
  OakHandDrawnHR,
  OakTypography,
  OakColorToken,
} from "@oaknational/oak-components";

import ScreenReaderOnly from "@/components/SharedComponents/ScreenReaderOnly/";
import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";
import Tag from "@/components/SharedComponents/TagPromotional";
import { ResolveOakHrefProps } from "@/common-lib/urls";

export type HomePageBannerProps = {
  background: OakColorToken;
  newText: string;
  ctaText: string;
} & ResolveOakHrefProps;

const HomePageBanner: FC<HomePageBannerProps> = ({
  background,
  newText,
  ctaText,
  ...linkProps
}) => (
  <OakBox role="banner">
    <OakFlex
      $background={background}
      $justifyContent={["center"]}
      $alignItems={"center"}
      $pv={"inner-padding-xs"}
      $ph={["inner-padding-xs", "inner-padding-s"]}
    >
      <OakFlex
        $alignItems={"center"}
        $flexWrap={"wrap"}
        $gap={["all-spacing-1", "all-spacing-8"]}
        $flexDirection={["column", "row"]}
        $justifyContent={"center"}
        $pv={"inner-padding-none"}
      >
        <OakFlex
          $alignItems={"center"}
          $gap={["all-spacing-0", "all-spacing-1"]}
          $minWidth={["fit-content"]}
        >
          <Tag aria-hidden="true" size={"small"} />
          <OakTypography $font={["body-3", "body-2"]}>
            <ScreenReaderOnly>New&nbsp;</ScreenReaderOnly> {newText}
          </OakTypography>
        </OakFlex>
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
      </OakFlex>
    </OakFlex>
    <OakBox $background={"lemon"} $height={"all-spacing-1"}>
      <OakHandDrawnHR hrColor={"black"} $height={"all-spacing-1"} />
    </OakBox>
  </OakBox>
);

export default HomePageBanner;
