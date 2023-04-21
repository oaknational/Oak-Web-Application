import { FC } from "react";

import Flex from "../Flex";
import Typography, { Heading, LI, P } from "../Typography";
import MaxWidth from "../MaxWidth/MaxWidth";
import Logo from "../Logo";
import SocialButtons from "../SocialButtons";
import Box from "../Box";
import { useCookieConsent } from "../../browser-lib/cookie-consent/CookieConsentProvider";
import useAnalytics from "../../context/Analytics/useAnalytics";
import UnstyledButton from "../UnstyledButton";
import footerSections from "../../browser-lib/fixtures/footerSections";
import Grid, { GridArea } from "../Grid";
import OakLink from "../OakLink";
import Svg from "../Svg";
import { OAK_SOCIALS } from "../SocialButtons/SocialButtons";

type FooterLinkProps = {
  text: string;
} & (
  | {
      href: string;
      type?: "link";
    }
  | {
      type: "consent-manager-toggle";
    }
  | {
      type: "pupils-link";
    }
  | {
      type: "teachers-link";
    }
);

const FooterLink: FC<FooterLinkProps> = (props) => {
  const { track } = useAnalytics();
  const { showConsentManager } = useCookieConsent();

  if (props.type === "consent-manager-toggle") {
    return (
      <UnstyledButton onClick={showConsentManager}>{props.text}</UnstyledButton>
    );
  }

  if (props.type === "pupils-link") {
    return (
      <OakLink
        page="classroom"
        htmlAnchorProps={{
          onClick: () => track.classroomSelected({ navigatedFrom: "footer" }),
        }}
      >
        {props.text}
      </OakLink>
    );
  }

  if (props.type === "teachers-link") {
    return (
      <OakLink
        page="teacher-hub"
        htmlAnchorProps={{
          onClick: () => track.teacherHubSelected({ navigatedFrom: "footer" }),
        }}
      >
        {props.text}
      </OakLink>
    );
  }
  // TODO: change data to have "page"
  return (
    <OakLink page={null} href={props.href}>
      {props.text}
    </OakLink>
  );
};

export type FooterSection = {
  title: string;
  links: FooterLinkProps[];
};
const FooterSectionLinks: FC<FooterSection> = ({ title, links }) => {
  return (
    <Flex $flexDirection="column" $mt={[32, 0]}>
      <Heading $mb={8} $font="body-2" $color="grey9" tag="h2">
        {title}
      </Heading>
      <Typography $font={"heading-7"}>
        <ul role="list">
          {links.map((link) => (
            <LI key={link.text} $mt={12}>
              <FooterLink {...link} />
            </LI>
          ))}
        </ul>
      </Typography>
    </Flex>
  );
};

export type FooterSections = Record<
  "pupils" | "teachers" | "oak" | "legal",
  FooterSection
>;

const SiteFooter: FC = () => {
  const sections = footerSections;
  return (
    <Box
      as="footer"
      $zIndex="neutral"
      $width="100%"
      $pt={[48, 80]}
      $background="white"
      $position={"relative"}
      $overflow={"hidden"}
    >
      <nav>
        <MaxWidth
          $justifyContent={"center"}
          $flexDirection={"column"}
          $ph={16}
          $ma={"auto"}
          $width={"100%"}
        >
          <Grid>
            <GridArea $colSpan={[12, 3]}>
              <FooterSectionLinks {...sections.pupils} />
              <Box $mt={[0, 24]} />
              <FooterSectionLinks {...sections.teachers} />
            </GridArea>
            <GridArea $colSpan={[12, 3]}>
              <FooterSectionLinks {...sections.oak} />
            </GridArea>
            <GridArea $colSpan={[12, 3]}>
              <FooterSectionLinks {...sections.legal} />
            </GridArea>
            <GridArea $colSpan={[12, 3]}>
              <Flex $justifyContent={["left", "right"]} $mt={[40, 0]}>
                <Logo height={66} width={150} />
              </Flex>
            </GridArea>
          </Grid>
          <Flex $mb={80} $mt={[172, 64]} $width={"100%"}>
            <SocialButtons for="Oak National Academy" {...OAK_SOCIALS} />
            <Flex $alignItems={"center"} $ml={[16]}>
              <P $textAlign="center" $font={["body-4", "body-2"]}>
                © Oak National Academy
              </P>
            </Flex>
          </Flex>
        </MaxWidth>
      </nav>
      <Svg
        name="looping-line-3"
        $color={"pupilsPink"}
        $zIndex={"behind"}
        $display={["none", "block"]}
        $transform={[
          "none",
          "translate(25%, 25%) scale(0.7) rotate(-10deg)",
          "translate(25%, 15%) rotate(-10deg)",
        ]}
        $cover
      />
      <Svg
        name="looping-line-4"
        $color={"twilight"}
        $display={["block", "none"]}
        $zIndex={"behind"}
        $transform={"translate(0%, 32%)"}
        $cover
      />
    </Box>
  );
};

export default SiteFooter;
