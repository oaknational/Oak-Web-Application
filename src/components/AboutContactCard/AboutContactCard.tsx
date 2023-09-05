import { FC } from "react";
import { PortableTextComponents } from "@portabletext/react";

import ButtonAsLink from "../Button/ButtonAsLink";
import Card from "../Card";
import Flex from "../Flex";
import { useNewsletterForm } from "../Forms/NewsletterForm";
import NewsletterFormWrap from "../Forms/NewsletterForm/NewsletterFormWrap";
import Grid, { GridArea } from "../Grid";
import BrushBorders from "../SpriteSheet/BrushSvgs/BrushBorders";
import { Heading } from "../Typography";
import Typography from "../Typography/Typography";
import { PortableTextJSON } from "../../common-lib/cms-types";
import { PortableTextWithDefaults } from "../PortableText";

const aboutContactCardPortableTextComponents: PortableTextComponents = {
  block: {
    sectionHeading: (props) => {
      return (
        <Heading $mb={8} $font={["heading-6", "heading-5"]} tag="h2">
          {props.children}
        </Heading>
      );
    },
    normal: (props) => {
      return (
        <Typography $mb={32} $font={["body-2", "body-1"]}>
          {props.children}
        </Typography>
      );
    },
  },
};

type AboutContactCardProps = {
  infoPortableText: PortableTextJSON;
};

const AboutContactCard: FC<AboutContactCardProps> = (props) => {
  const { onSubmit } = useNewsletterForm();
  return (
    <Flex $position={"relative"} $width={"100%"}>
      <BrushBorders hideOnMobileH hideOnMobileV color={"pupilsLightGreen"} />
      <Grid>
        <GridArea $order={[2, 1]} $colSpan={[12, 6, 8]}>
          <Card
            $pa={[16, 24]}
            $justifyContent={["center"]}
            $background={"pupilsLightGreen"}
            $pt={[32, 0]}
          >
            <PortableTextWithDefaults
              components={aboutContactCardPortableTextComponents}
              value={props.infoPortableText}
            />
            <Flex $mb={[32, 0]}>
              <ButtonAsLink label={"Contact us"} page="contact" />
            </Flex>
          </Card>
        </GridArea>
        <GridArea $mb={[80, 0]} $order={[1, 2]} $colSpan={[12, 6, 4]}>
          <Flex $background={"pupilsLightGreen"} $pa={[0, 24]}>
            <NewsletterFormWrap onSubmit={onSubmit} />
          </Flex>
        </GridArea>
      </Grid>
    </Flex>
  );
};

export default AboutContactCard;
