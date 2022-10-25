import { FC } from "react";

import { CTA } from "../../../common-lib/cms-types";
import { getCTAHref } from "../../../utils/portableText/resolveInternalHref";
import ButtonAsLink from "../../Button/ButtonAsLink";
import Flex from "../../Flex";
import { Heading } from "../../Typography";

export const LandingPageTitle: FC<{
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
      <Heading
        $mb={[8]}
        $font={["heading-6", "heading-5"]}
        $color={"grey6"}
        tag="h1"
      >
        {title}
      </Heading>
      {heading && (
        <Heading
          $font={["heading-4", "heading-5"]}
          $mv={[0]}
          tag="h2"
          $textAlign={["left", leftAlign ? "start" : "center"]}
        >
          {heading}
        </Heading>
      )}
      {cta && (
        <ButtonAsLink
          icon="ArrowRight"
          iconPosition={"trailing"}
          $mt={[48, 32]}
          label={cta.label}
          href={getCTAHref(cta)}
        />
      )}
    </Flex>
  );
};

export default LandingPageTitle;
