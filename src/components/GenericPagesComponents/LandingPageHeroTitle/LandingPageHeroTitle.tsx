import { FC } from "react";
import { OakHeading } from "@oaknational/oak-components";

import { CTA } from "@/common-lib/cms-types";
import { getLinkHref } from "@/utils/portableText/resolveInternalHref";
import ButtonAsLink from "@/components/SharedComponents/Button/ButtonAsLink";
import Flex from "@/components/SharedComponents/Flex.deprecated";

export const LandingPageHeroTitle: FC<{
  title: string;
  heading?: string | null;
  cta?: CTA | null;
  leftAlign?: boolean;
}> = ({ cta, heading, title, leftAlign }) => {
  return (
    <Flex
      $maxWidth={840}
      $mb={[92]}
      $flexDirection={"column"}
      $alignItems={["flex-start", leftAlign ? "flex-start" : "center"]}
      $ph={16}
    >
      <OakHeading
        $mb={["space-between-ssx"]}
        $font={["heading-6", "heading-5"]}
        $color={"grey50"}
        tag="h1"
      >
        {title}
      </OakHeading>
      {heading && (
        <OakHeading
          $font={["heading-4", "heading-5"]}
          $mv={["space-between-none"]}
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
    </Flex>
  );
};

export default LandingPageHeroTitle;
