import { FC, ReactNode } from "react";
import { useRouter } from "next/router";
import {
  OakGrid,
  OakGridArea,
  OakTypography,
  OakHeading,
  OakLI,
  OakP,
  OakFlex,
} from "@oaknational/oak-components";

import Logo from "@/components/AppComponents/Logo";
import OwaLink from "@/components/SharedComponents/OwaLink";
import { OAK_SOCIALS } from "@/components/SharedComponents/SocialButtons/SocialButtons";
import LayoutSiteFooterSignpost from "@/components/AppComponents/LayoutSiteFooterSignpost";
import SocialButtons from "@/components/SharedComponents/SocialButtons";
import Icon, { IconName } from "@/components/SharedComponents/Icon";
import Svg from "@/components/SharedComponents/Svg";
import Button from "@/components/SharedComponents/Button";
import Box from "@/components/SharedComponents/Box";
import MaxWidth from "@/components/SharedComponents/MaxWidth";
import { useCookieConsent } from "@/browser-lib/cookie-consent/CookieConsentProvider";
import footerSections from "@/browser-lib/fixtures/footerSections";
import useAnalytics from "@/context/Analytics/useAnalytics";
import { OakLinkProps } from "@/common-lib/urls";
import useClickableCard from "@/hooks/useClickableCard";

type LayoutFooterLinkProps = {
  text: string;
  icon?: IconName;
  ariaLabel?: string;
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
} & LayoutFooterLinkProps;

const FooterLinkIconWrapper: React.FC<FooterLinkIconWrapperProps> = (props) => {
  const { containerProps, icon, children } = props;
  return (
    <OakFlex $display={"inline-flex"} {...containerProps}>
      {children}
      {icon && <Icon name={icon} $ml={8} />}
    </OakFlex>
  );
};

const FooterLink: FC<LayoutFooterLinkProps> = (props) => {
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
        labelColor={"black"}
        $hoverStyles={["underline-link-text"]}
      />
    );
  }

  if (props.type === "page" && props.page == "classroom") {
    return (
      <FooterLinkIconWrapper containerProps={containerProps} {...props}>
        <OwaLink
          {...props}
          {...primaryTargetProps}
          $focusStyles={["underline"]}
          htmlAnchorProps={{
            onClick: () => track.classroomSelected({ navigatedFrom: "footer" }),
          }}
        >
          {props.text}
        </OwaLink>
      </FooterLinkIconWrapper>
    );
  }

  if (props.type === "page" && props.page == "teacher-hub") {
    return (
      <FooterLinkIconWrapper containerProps={containerProps} {...props}>
        <OwaLink
          {...props}
          {...primaryTargetProps}
          $focusStyles={["underline"]}
          htmlAnchorProps={{
            onClick: () =>
              track.teacherHubSelected({ navigatedFrom: "footer" }),
            "aria-label": props.ariaLabel || undefined,
          }}
        >
          {props.text}
        </OwaLink>
      </FooterLinkIconWrapper>
    );
  }
  if (props.type === "page") {
    return (
      <FooterLinkIconWrapper containerProps={containerProps} {...props}>
        <OwaLink
          {...primaryTargetProps}
          $focusStyles={["underline"]}
          htmlAnchorProps={{ "aria-label": props.ariaLabel || undefined }}
          {...props}
        >
          {props.text}
        </OwaLink>
      </FooterLinkIconWrapper>
    );
  }
  if (props.href) {
    return (
      <FooterLinkIconWrapper containerProps={containerProps} {...props}>
        <OwaLink
          {...primaryTargetProps}
          $focusStyles={["underline"]}
          page={null}
          href={props.href}
          htmlAnchorProps={{ "aria-label": props.ariaLabel || undefined }}
        >
          {props.text}
        </OwaLink>
      </FooterLinkIconWrapper>
    );
  }
};

export type FooterSection = {
  title: string;
  links: LayoutFooterLinkProps[];
};
const FooterSectionLinks: FC<FooterSection> = ({ title, links }) => {
  return (
    <OakFlex
      $flexDirection="column"
      $mt={["space-between-m2", "space-between-none"]}
    >
      <OakHeading
        $mb="space-between-ssx"
        $font="heading-7"
        $color="black"
        tag="h2"
      >
        {title}
      </OakHeading>
      <OakTypography $color={"black"} $font={"body-2"}>
        <ul role="list">
          {links.map((link) => (
            <OakLI key={link.text} $mt="space-between-xs">
              <FooterLink {...link} />
            </OakLI>
          ))}
        </ul>
      </OakTypography>
    </OakFlex>
  );
};

export type FooterSections = Record<
  "pupils" | "teachers" | "oak" | "legal",
  FooterSection
>;

const LayoutSiteFooter: FC = () => {
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
      <OakFlex $height="all-spacing-1" $position="relative">
        <Svg name="header-underline" $color="black" />
      </OakFlex>
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
            <OakFlex
              $wordWrap={"initial"}
              $mb={["space-between-s", "space-between-xl"]}
              $maxWidth={["all-spacing-21", "all-spacing-22", "all-spacing-22"]}
            >
              <LayoutSiteFooterSignpost />
            </OakFlex>
          )}
          <OakGrid>
            <OakGridArea $colSpan={[12, 3]}>
              <FooterSectionLinks {...sections.pupils} />
              <Box $mt={[0, 32]} />
              <FooterSectionLinks {...sections.teachers} />
            </OakGridArea>
            <OakGridArea $colSpan={[12, 3]}>
              <FooterSectionLinks {...sections.oak} />
            </OakGridArea>
            <OakGridArea $colSpan={[12, 3]}>
              <FooterSectionLinks {...sections.legal} />
            </OakGridArea>
            <OakGridArea $colSpan={[12, 3]}>
              <OakFlex
                $justifyContent={["left", "right"]}
                $mt={["space-between-m2", "space-between-none"]}
              >
                <Box $display={["none", "block"]}>
                  <Logo variant="with text" height={66} width={150} />
                </Box>
                <SocialButtons
                  $display={["flex", "none"]}
                  for="Oak National Academy"
                  {...OAK_SOCIALS}
                />
              </OakFlex>
            </OakGridArea>
          </OakGrid>
          <OakFlex
            $mb="space-between-xl"
            $mt={["space-between-m2", "space-between-xl"]}
            $width={"100%"}
            $justifyContent={["flex-start", "space-between"]}
            $flexDirection={["column", "row"]}
            $alignItems={["flex-start", "center"]}
            $pt={["inner-padding-s", "inner-padding-none"]}
          >
            <SocialButtons
              $display={["none", "flex"]}
              for="Oak National Academy"
              {...OAK_SOCIALS}
            />
            <Box $ml={-4} $display={["block", "none"]}>
              <Logo variant="with text" height={66} width={150} />
            </Box>
            <OakFlex
              $mt={["space-between-m2", "space-between-none"]}
              $flexDirection={"column"}
            >
              <OakP $font={"body-3-bold"}>
                © Oak National Academy Limited, No 14174888
              </OakP>
              <OakP $font={["body-4"]}>
                1 Scott Place, 2 Hardman Street, Manchester, M3 3AA
              </OakP>
            </OakFlex>
          </OakFlex>
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

export default LayoutSiteFooter;
