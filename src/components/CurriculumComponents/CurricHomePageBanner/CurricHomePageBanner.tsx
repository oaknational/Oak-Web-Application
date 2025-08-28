import { FC, ReactNode } from "react";
import {
  OakFlex,
  OakBox,
  OakHandDrawnHR,
  OakColorToken,
} from "@oaknational/oak-components";

import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";
import { ResolveOakHrefProps } from "@/common-lib/urls";

export type HomePageBannerProps = {
  background: OakColorToken;
  message: ReactNode;
  ctaText: string;
} & ResolveOakHrefProps;

const PromoBanner: FC<HomePageBannerProps> = ({
  background,
  message,
  ctaText,
  ...linkProps
}) => {
  return (
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
            {message}
          </OakFlex>
          <ButtonAsLink
            $ml={[20, 0]}
            {...linkProps}
            label={ctaText}
            variant={"buttonStyledAsLink"}
            icon={"chevron-right"}
            $iconPosition={"trailing"}
            iconBackground="transparent"
            $mh={0}
          />
        </OakFlex>
      </OakFlex>
      <OakBox $background={background} $height={"all-spacing-1"}>
        <OakHandDrawnHR hrColor={"black"} $height={"all-spacing-1"} />
      </OakBox>
    </OakBox>
  );
};

export default PromoBanner;
