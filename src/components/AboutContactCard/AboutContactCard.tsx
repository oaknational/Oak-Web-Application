import { FC, Fragment } from "react";

import ButtonAsLink from "../Button/ButtonAsLink";
import Card from "../Card";
import Flex from "../Flex";
import NewsletterForm, { useNewsletterForm } from "../Forms/NewsletterForm";
import Grid, { GridArea } from "../Grid";
import BrushBorders from "../SpriteSheet/BrushSvgs/BrushBorders";
import { Heading, P } from "../Typography";

const cardCopy = [
  {
    heading: "General enquiries",
    p: "For general enquiries and help please email ",
    linkText: "help@thenational.academy",
    href: "mailto: help@thenational.academy",
    linkType: "email",
  },
  {
    heading: "Media enquiries",
    p: "For media enquiries, please contact ",
    linkText: "media@thenational.academy",
    href: "mailto: media@thenational.academy",
    linkType: "email",
  },
  {
    heading: "Find help",
    p: "Search our FAQs and find useful information for teachers, schools, pupils and parents in our ",
    linkText: "help centre",
    href: "https://support.thenational.academy",
    linkType: "link",
  },
];

const AboutContactCard: FC = () => {
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
            {cardCopy.map((section) => (
              <Fragment key={section.heading}>
                <Heading $mb={8} $fontSize={[20, 24]} tag={"h4"}>
                  {section.heading}
                </Heading>
                <P $mb={32} $fontSize={[16, 18]}>
                  {section.p}
                  <a href={section.href}>{section.linkText}</a>.
                </P>
              </Fragment>
            ))}
            <Flex $mb={[32, 0]}>
              <ButtonAsLink label={"Contact us"} href={"/contact-us"} />
            </Flex>
          </Card>
        </GridArea>
        <GridArea $mb={[80, 0]} $order={[1, 2]} $colSpan={[12, 6, 4]}>
          <Flex $background={"pupilsLightGreen"} $pa={[0, 24]}>
            <NewsletterForm onSubmit={onSubmit} />
          </Flex>
        </GridArea>
      </Grid>
    </Flex>
  );
};

export default AboutContactCard;
