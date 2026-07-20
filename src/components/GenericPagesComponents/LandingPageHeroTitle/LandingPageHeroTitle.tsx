import Link from "next/link";
import { FC } from "react";
import {
  OakFlex,
  OakHeading,
  OakTertiaryButton,
} from "@oaknational/oak-components";

import { CTA } from "@/common-lib/cms-types";
import { getLinkHref } from "@/utils/portableText/resolveInternalHref";

export const LandingPageHeroTitle: FC<{
  title: string;
  heading?: string | null;
  cta?: CTA | null;
  leftAlign?: boolean;
}> = ({ cta, heading, title, leftAlign }) => {
  return (
    <OakFlex
      $maxWidth={"spacing-960"}
      $mb={"spacing-80"}
      $flexDirection={"column"}
      $alignItems={["flex-start", leftAlign ? "flex-start" : "center"]}
      $ph={"spacing-16"}
    >
      <OakHeading
        $mb={["spacing-8"]}
        $font={["heading-6", "heading-5"]}
        $color={"text-disabled"}
        tag="h1"
      >
        {title}
      </OakHeading>
      {heading && (
        <OakHeading
          $font={["heading-4", "heading-5"]}
          $mv={["spacing-0"]}
          tag="h2"
          $textAlign={["left", leftAlign ? "start" : "center"]}
        >
          {heading}
        </OakHeading>
      )}
      {cta && (
        <OakTertiaryButton
          $mt={["spacing-48", "spacing-32"]}
          element={Link}
          iconName="arrow-right"
          isTrailingIcon
          href={getLinkHref(cta)}
        >
          {cta.label}
        </OakTertiaryButton>
      )}
    </OakFlex>
  );
};

export default LandingPageHeroTitle;
