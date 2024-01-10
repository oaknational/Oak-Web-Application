import { FC } from "react";

import { LandingPage } from "@/common-lib/cms-types";
import LandingPageHeroTitle from "@/components/GenericPagesComponents/LandingPageHeroTitle";
import CMSImage from "@/components/SharedComponents/CMSImage";
import Flex from "@/components/SharedComponents/Flex";

export type LandingPageHeroProps = Pick<LandingPage, "hero">;

/**
 * Hero for landing pages, takes optional cta and image-
 *
 */
const LandingPageHero: FC<LandingPageHeroProps> = (props) => {
  return (
    <Flex $flexDirection={["column", "row"]} $mt={[92]}>
      <Flex $justifyContent={"center"} $width={"100%"}>
        <LandingPageHeroTitle
          leftAlign={props.hero.image ? true : false}
          heading={props.hero.heading}
          title={props.hero.title}
          cta={props.hero.cta}
        />
      </Flex>

      {props.hero.image && (
        <Flex $ph={[16, 56]} $minWidth={["100%", "50%"]}>
          <CMSImage image={props.hero.image} />
        </Flex>
      )}
    </Flex>
  );
};

export default LandingPageHero;
