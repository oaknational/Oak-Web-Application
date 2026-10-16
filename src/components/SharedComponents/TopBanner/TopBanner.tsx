import {
  OakFlex,
  OakBox,
  OakSmallTertiaryInvertedButton,
  OakSpan,
  OakP,
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
  topBanner,
}: Readonly<{
  topBanner: TopBannerProps;
}>) {
  return (
    <OakBox role="banner">
      <OakFlex
        $background={topBanner.backgroundColour ?? "bg-decorative1-main"}
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
          >
            {topBanner.messagePortableText && (
              <PortableTextWithDefaults
                value={topBanner.messagePortableText}
                components={topBannerPortableTextComponents}
              />
            )}
          </OakFlex>
          {topBanner.ctaText && topBanner.ctaLink && (
            <OakSmallTertiaryInvertedButton
              element={Link}
              href={topBanner.ctaLink}
              title={topBanner.ctaText}
              iconName="chevron-right"
              isTrailingIcon={true}
            >
              <OakSpan $font={"heading-7"}>{topBanner.ctaText}</OakSpan>
            </OakSmallTertiaryInvertedButton>
          )}
        </OakFlex>
      </OakFlex>
    </OakBox>
  );
}
