import {
  OakFlex,
  OakBox,
  OakSmallTertiaryInvertedButton,
  OakSpan,
  OakP,
  OakPromoTag,
} from "@oaknational/oak-components";
import { z } from "zod";
import Link from "next/link";
import type { PortableTextComponents } from "@portabletext/react";

import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";
import { topBannerSchema } from "@/common-lib/cms-types";

export type TopBannerProps = z.infer<typeof topBannerSchema>;

const topBannerPortableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <OakP $font="body-2" $mt="spacing-0">
        {children}
      </OakP>
    ),
  },
};

export default function TopBanner({
  displayNewTag,
  messagePortableText,
  displayCta,
  cta,
  backgroundColour,
}: Readonly<TopBannerProps>) {
  return (
    <OakBox role="banner">
      <OakFlex
        $background={backgroundColour}
        $justifyContent={["center"]}
        $alignItems={"center"}
        $pv={"spacing-8"}
        $ph={["spacing-8", "spacing-12"]}
        $bb={"border-solid-m"}
        $borderColor={"border-primary"}
      >
        <OakFlex
          $alignItems={"center"}
          $flexWrap={"wrap"}
          $gap={["spacing-12", "spacing-32"]}
          $flexDirection={["column", "row"]}
          $justifyContent={"center"}
          $pv={"spacing-0"}
        >
          <OakFlex
            $alignItems={"center"}
            $gap={["spacing-0", "spacing-4"]}
            $minWidth={["fit-content"]}
            $textAlign="center"
          >
            {displayNewTag && <OakPromoTag />}
            {messagePortableText && (
              <PortableTextWithDefaults
                value={messagePortableText}
                components={topBannerPortableTextComponents}
              />
            )}
          </OakFlex>
          {displayCta && cta && (
            <OakSmallTertiaryInvertedButton
              element={Link}
              href={cta.linkType === "internal" ? cta.internal : cta.external}
              title={cta.label}
              iconName="chevron-right"
              isTrailingIcon={true}
            >
              <OakSpan $font={"heading-7"}>{cta.label}</OakSpan>
            </OakSmallTertiaryInvertedButton>
          )}
        </OakFlex>
      </OakFlex>
    </OakBox>
  );
}
