import Link from "next/link";
import { FC } from "react";

import Flex from "../Flex";
import Typography, { Heading, LI, P } from "../Typography";
import MaxWidth from "../MaxWidth/MaxWidth";
import Logo from "../Logo";
import SocialButtons from "../SocialButtons";
import Box from "../Box";
import { useCookieConsent } from "../../browser-lib/cookie-consent/CookieConsentProvider";
import { getPupilsUrl, getTeachersUrl } from "../../common-lib/urls";
import useAnalytics from "../../context/Analytics/useAnalytics";
import UnstyledButton from "../UnstyledButton";
import footerSections from "../../browser-lib/fixtures/footerSections";
import Grid, { GridArea } from "../Grid";

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
    const href = getPupilsUrl();
    return (
      <Link href={href}>
        <a
          onClick={() => track.classroomSelected({ navigatedFrom: "footer" })}
          target="_blank"
        >
          {props.text}
        </a>
      </Link>
    );
  }

  if (props.type === "teachers-link") {
    const href = getTeachersUrl();
    return (
      <Link href={href}>
        <a
          onClick={() => track.teacherHubSelected({ navigatedFrom: "footer" })}
          target="_blank"
        >
          {props.text}
        </a>
      </Link>
    );
  }

  return <Link href={props.href}>{props.text}</Link>;
};

export type FooterSection = {
  title: string;
  links: FooterLinkProps[];
};
const FooterSectionLinks: FC<FooterSection> = ({ title, links }) => {
  return (
    <Flex $flexDirection="column" $mt={[32, 0]}>
      <Heading
        $mb={8}
        $fontSize={16}
        $lineHeight="20px"
        $color="grey9"
        tag="h2"
        $fontFamily={"body"}
      >
        {title}
      </Heading>
      <Typography $fontSize={16} $lineHeight={"20px"} $fontFamily={"ui"}>
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
      $mt={[48, 80]}
      $background="white"
    >
      <nav>
        <MaxWidth
          $position={"relative"}
          $justifyContent={"center"}
          $flexDirection={"column"}
          $ph={12}
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
                <Logo title={"Oak National Academy"} height={66} width={150} />
              </Flex>
            </GridArea>
          </Grid>
          <Flex $mb={80} $mt={64} $width={"100%"}>
            <SocialButtons />
            <Flex $alignItems={"center"}>
              <P $lineHeight={"16px"} $textAlign="center" $fontSize={[12, 16]}>
                © Oak National Academy
              </P>
            </Flex>
          </Flex>
        </MaxWidth>
      </nav>
    </Box>
  );
};

export default SiteFooter;
