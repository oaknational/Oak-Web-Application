import { FC, ReactNode } from "react";
import {
  OakFlex,
  OakBox,
  OakHandDrawnHR,
  OakUiRoleToken,
  OakSmallTertiaryInvertedButton,
  OakSpan,
} from "@oaknational/oak-components";
import Link from "next/link";

import { ResolveOakHrefProps, resolveOakHref } from "@/common-lib/urls";

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
  const href = resolveOakHref(linkProps);
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
          $gap={["spacing-20", "spacing-40"]}
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
          <OakSmallTertiaryInvertedButton
            element={Link}
            href={href}
            title={ctaText}
            iconName="chevron-right"
            isTrailingIcon={true}
          >
            <OakSpan $font={"heading-7"}>{ctaText}</OakSpan>
          </OakSmallTertiaryInvertedButton>
        </OakFlex>
      </OakFlex>
      <OakBox $background={background} $height={"spacing-4"}>
        <OakHandDrawnHR hrColor={"bg-inverted"} $height={"spacing-4"} />
      </OakBox>
    </OakBox>
  );
};

export default PromoBanner;
