import { FC, ReactNode } from "react";
import { useRouter } from "next/router";

import Typography, { Heading, LI, P } from "../Typography";
import Logo from "../Logo";
import SocialButtons from "../SocialButtons";
import Grid, { GridArea } from "../Grid";
import OakLink from "../OakLink";
import Svg from "../Svg";
import { OAK_SOCIALS } from "../SocialButtons/SocialButtons";
import FooterSignpost from "../FooterSignpost/FooterSignpost";
import { IconName } from "../Icon";
import Icon from "../Icon/Icon";

import Button from "@/components/SharedComponents/Button";
import Box from "@/components/SharedComponents/Box";
import MaxWidth from "@/components/SharedComponents/MaxWidth";
import Flex from "@/components/SharedComponents/Flex";
import { useCookieConsent } from "@/browser-lib/cookie-consent/CookieConsentProvider";
import footerSections from "@/browser-lib/fixtures/footerSections";
import useAnalytics from "@/context/Analytics/useAnalytics";
import { OakLinkProps } from "@/common-lib/urls";
import useClickableCard from "@/hooks/useClickableCard";

type FooterLinkProps = {
  text: string;
  icon?: IconName;
} & (
  | {
      href: string;
      type?: "link";
    }
  | {
      type: "consent-manager-toggle";
    }
  | ({
      type: "page";
    } & OakLinkProps)
);

type FooterLinkIconWrapperProps = {
  children: ReactNode;
  containerProps: ReturnType<typeof useClickableCard>["containerProps"];
} & FooterLinkProps;

const FooterLinkIconWrapper: React.FC<FooterLinkIconWrapperProps> = (props) => {
  const { containerProps, icon, children } = props;
  return (
    <Flex $display={"inline-flex"} {...containerProps}>
      {children}
      {icon && <Icon name={icon} $ml={8} />}
    </Flex>
  );
};

const FooterLink: FC<FooterLinkProps> = (props) => {
  const { track } = useAnalytics();
  const { showConsentManager } = useCookieConsent();
  const { containerProps, primaryTargetProps } =
    useClickableCard<HTMLAnchorElement>();

  if (props.type === "consent-manager-toggle") {
    return (
      <Button
        variant="minimal"
        $font={"body-2"}
        label={props.text}
        onClick={showConsentManager}
        $hoverStyles={["underline-link-text"]}
      >
        {props.text}
      </Button>
    );
  }

  if (props.type === "page" && props.page == "classroom") {
    return (
      <FooterLinkIconWrapper containerProps={containerProps} {...props}>
        <OakLink
          {...props}
          {...primaryTargetProps}
          $focusStyles={["underline"]}
          htmlAnchorProps={{
            onClick: () => track.classroomSelected({ navigatedFrom: "footer" }),
          }}
        >
          {props.text}
        </OakLink>
      </FooterLinkIconWrapper>
    );
  }

  if (props.type === "page" && props.page == "teacher-hub") {
    return (
      <FooterLinkIconWrapper containerProps={containerProps} {...props}>
        <OakLink
          {...props}
          {...primaryTargetProps}
          $focusStyles={["underline"]}
          htmlAnchorProps={{
            onClick: () =>
              track.teacherHubSelected({ navigatedFrom: "footer" }),
          }}
        >
          {props.text}
        </OakLink>
      </FooterLinkIconWrapper>
    );
  }
  if (props.type === "page") {
    return (
      <FooterLinkIconWrapper containerProps={containerProps} {...props}>
        <OakLink
          {...primaryTargetProps}
          $focusStyles={["underline"]}
          {...props}
        >
          {props.text}
        </OakLink>
      </FooterLinkIconWrapper>
    );
  }
  if (props.href) {
    return (
      <FooterLinkIconWrapper containerProps={containerProps} {...props}>
        <OakLink
          {...primaryTargetProps}
          $focusStyles={["underline"]}
          page={null}
          href={props.href}
        >
          {props.text}
        </OakLink>
      </FooterLinkIconWrapper>
    );
  }
};

export type FooterSection = {
  title: string;
  links: FooterLinkProps[];
};
const FooterSectionLinks: FC<FooterSection> = ({ title, links }) => {
  return (
    <Flex $flexDirection="column" $mt={[32, 0]}>
      <Heading $mb={8} $font="heading-7" $color="black" tag="h2">
        {title}
      </Heading>
      <Typography $color={"black"} $font={"body-2"}>
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
  const { pathname } = useRouter();
  const displaySignpost = pathname.startsWith("/beta");

  return (
    <Box
      as="footer"
      $zIndex="neutral"
      $width="100%"
      $background="white"
      $position={"relative"}
      $overflow={"hidden"}
    >
      <Flex $height={4} $position="relative">
        <Svg name="header-underline" $color="black" />
      </Flex>
      <nav>
        <MaxWidth
          $pt={[16, 80]}
          $justifyContent={"center"}
          $flexDirection={"column"}
          $ph={16}
          $ma={"auto"}
          $width={"100%"}
        >
          {displaySignpost && (
            <Flex
              $wordWrap={"initial"}
              $mb={[16, 64]}
              $maxWidth={[360, 720, 740]}
            >
              <FooterSignpost />
            </Flex>
          )}
          <Grid>
            <GridArea $colSpan={[12, 3]}>
              <FooterSectionLinks {...sections.pupils} />
              <Box $mt={[0, 32]} />
              <FooterSectionLinks {...sections.teachers} />
            </GridArea>
            <GridArea $colSpan={[12, 3]}>
              <FooterSectionLinks {...sections.oak} />
            </GridArea>
            <GridArea $colSpan={[12, 3]}>
              <FooterSectionLinks {...sections.legal} />
            </GridArea>
            <GridArea $colSpan={[12, 3]}>
              <Flex $justifyContent={["left", "right"]} $mt={[32, 0]}>
                <Box $display={["none", "block"]}>
                  <Logo variant="with text" height={66} width={150} />
                </Box>
                <SocialButtons
                  $display={["flex", "none"]}
                  for="Oak National Academy"
                  {...OAK_SOCIALS}
                />
              </Flex>
            </GridArea>
          </Grid>
          <Flex
            $mb={56}
            $mt={[32, 64]}
            $width={"100%"}
            $justifyContent={["flex-start", "space-between"]}
            $flexDirection={["column", "row"]}
            $alignItems={["flex-start", "center"]}
            $pt={[12, 0]}
          >
            <SocialButtons
              $display={["none", "flex"]}
              for="Oak National Academy"
              {...OAK_SOCIALS}
            />
            <Box $ml={-4} $display={["block", "none"]}>
              <Logo variant="with text" height={66} width={150} />
            </Box>
            <Flex $mt={[32, 0]} $flexDirection={"column"}>
              <P $font={"body-3-bold"}>
                © Oak National Academy Limited, No 14174888
              </P>
              <P $font={["body-4"]}>
                1 Scott Place, 2 Hardman Street, Manchester, M3 3AA
              </P>
            </Flex>
          </Flex>
        </MaxWidth>
      </nav>
      <Svg
        name="looping-line-3"
        $color={"mint"}
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
        $color={"pink50"}
        $display={["block", "none"]}
        $zIndex={"behind"}
        $transform={"translate(0%, 32%)"}
        $cover
      />
    </Box>
  );
};

export default SiteFooter;
