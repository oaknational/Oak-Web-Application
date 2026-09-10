import { FC } from "react";
import { OakFlex } from "@oaknational/oak-components";

import { LandingPage } from "@/common-lib/cms-types";
import LandingPageHeroTitle from "@/components/GenericPagesComponents/LandingPageHeroTitle";
import CMSImage from "@/components/SharedComponents/CMSImage";

export type LandingPageHeroProps = Pick<LandingPage, "hero">;

/**
 * Hero for landing pages, takes optional cta and image-
 *
 */
const LandingPageHero: FC<LandingPageHeroProps> = (props) => {
  return (
    <OakFlex $flexDirection={["column", "row"]} $mt={["spacing-80"]}>
      <OakFlex $justifyContent={"center"} $width={"100%"}>
        <LandingPageHeroTitle
          leftAlign={!!props.hero.image}
          heading={props.hero.heading}
          title={props.hero.title}
          cta={props.hero.cta}
        />
      </OakFlex>

      {props.hero.image && (
        <OakFlex $ph={["spacing-16", "spacing-56"]} $minWidth={["100%", "50%"]}>
          <CMSImage image={props.hero.image} />
        </OakFlex>
      )}
    </OakFlex>
  );
};

export default LandingPageHero;
