import { FC } from "react";
import { OakFlex, OakHeading } from "@oaknational/oak-components";

import { CTA } from "@/common-lib/cms-types";
import { getLinkHref } from "@/utils/portableText/resolveInternalHref";
import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";

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
        <ButtonAsLink
          icon="arrow-right"
          $iconPosition={"trailing"}
          $mt={[48, 32]}
          label={cta.label}
          page={null}
          href={getLinkHref(cta)}
        />
      )}
    </OakFlex>
  );
};

export default LandingPageHeroTitle;
