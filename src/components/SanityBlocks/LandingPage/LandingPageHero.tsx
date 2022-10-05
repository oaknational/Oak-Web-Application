import { FC } from "react";

import { LandingPage } from "../../../node-lib/cms";
import Flex from "../../Flex";
import CMSImage from "../../CMSImage";

import LandingPageTitle from "./LandingPageTitle";

export type LandingPageHeroProps = Pick<LandingPage, "hero">;

const LandingPageHero: FC<LandingPageHeroProps> = (props) => {
  return (
    <Flex $flexDirection={["column", "row"]} $mv={[92]}>
      <Flex $width={"100%"}>
        <LandingPageTitle
          image={props.hero.image ? true : false}
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
