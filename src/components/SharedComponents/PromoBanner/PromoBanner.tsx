import { FC, ReactNode } from "react";
import {
  OakFlex,
  OakBox,
  OakHandDrawnHR,
  OakUiRoleToken,
} from "@oaknational/oak-components";

import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";
import { ResolveOakHrefProps } from "@/common-lib/urls";

export type PromoBannerProps = {
  background: OakUiRoleToken;
  message: ReactNode;
  ctaText: string;
} & ResolveOakHrefProps;

const PromoBanner: FC<PromoBannerProps> = ({
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
        $pv={"spacing-8"}
        $ph={["spacing-8", "spacing-12"]}
      >
        <OakFlex
          $alignItems={"center"}
          $flexWrap={"wrap"}
          $gap={["spacing-4", "spacing-40"]}
          $flexDirection={["column", "row"]}
          $justifyContent={"center"}
          $pv={"spacing-0"}
        >
          <OakFlex
            $alignItems={"center"}
            $gap={["spacing-0", "spacing-4"]}
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
      <OakBox $background={background} $height={"spacing-4"}>
        <OakHandDrawnHR hrColor={"bg-inverted"} $height={"spacing-4"} />
      </OakBox>
    </OakBox>
  );
};

export default PromoBanner;
