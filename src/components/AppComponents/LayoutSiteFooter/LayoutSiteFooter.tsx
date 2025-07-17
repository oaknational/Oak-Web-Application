import { FC, ReactNode } from "react";
import { useRouter } from "next/router";
import { keystageDescriptions } from "@oaknational/oak-curriculum-schema";
import {
  OakGrid,
  OakGridArea,
  OakTypography,
  OakHeading,
  OakLI,
  OakP,
  OakFlex,
  OakIcon,
  OakIconName,
  useCookieConsent,
  OakBox,
  OakMaxWidth,
  OakSvg,
  OakImage,
} from "@oaknational/oak-components";
import styled from "styled-components";

import Logo from "@/components/AppComponents/Logo";
import OwaLink from "@/components/SharedComponents/OwaLink";
import { OAK_SOCIALS } from "@/components/SharedComponents/SocialButtons/SocialButtons";
import LayoutSiteFooterSignpost from "@/components/AppComponents/LayoutSiteFooterSignpost";
import SocialButtons from "@/components/SharedComponents/SocialButtons";
import Button from "@/components/SharedComponents/Button";
import footerSections from "@/browser-lib/fixtures/footerSections";
import useAnalytics from "@/context/Analytics/useAnalytics";
import { OakLinkProps } from "@/common-lib/urls";
import useClickableCard from "@/hooks/useClickableCard";
import { toSentenceCase } from "@/node-lib/curriculum-api-2023/helpers";
import { getCloudinaryImageUrl } from "@/utils/getCloudinaryImageUrl";

type LayoutFooterLinkProps = {
  text: string;
  icon?: OakIconName;
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
      {icon && (
        <OakIcon
          iconName={icon}
          $height={"all-spacing-6"}
          $width={"all-spacing-6"}
          $ml={"space-between-sssx"}
        />
      )}
    </OakFlex>
  );
};

const FooterLink: FC<LayoutFooterLinkProps> = (props) => {
  const { track } = useAnalytics();
  const { openSettings } = useCookieConsent();
  const { containerProps, primaryTargetProps } =
    useClickableCard<HTMLAnchorElement>();
  if (props.type === "consent-manager-toggle") {
    return (
      <Button
        variant="minimal"
        $font={"body-2"}
        label={props.text}
        onClick={openSettings}
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

  if (props.type === "page") {
    return (
      <FooterLinkIconWrapper containerProps={containerProps} {...props}>
        <OwaLink
          {...primaryTargetProps}
          $focusStyles={["underline"]}
          htmlAnchorProps={{ "aria-label": props.ariaLabel ?? undefined }}
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
          htmlAnchorProps={{ "aria-label": props.ariaLabel ?? undefined }}
          onClick={() => {
            const sentenceCaseText = props.text
              .split(" ")
              .map(toSentenceCase)
              .join(" ");

            if (keystageDescriptions.safeParse(sentenceCaseText).success) {
              track.browseRefinedAccessed({
                platform: "owa",
                product: "teacher lesson resources",
                engagementIntent: "refine",
                componentType: "footer_menu_link",
                eventVersion: "2.0.0",
                analyticsUseCase: "Teacher",
                filterType: "Key stage filter",
                filterValue: props.text,
                activeFilters: [],
              });
            }
          }}
        >
          {props.text}
        </OwaLink>
      </FooterLinkIconWrapper>
    );
  }
};

const StyledLogo = styled(OakImage)`
  height: 87px;
  width: 77px;
  margin-top: 2rem;
`;

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
    <OakBox
      as="footer"
      $zIndex="neutral"
      $width="100%"
      $background="white"
      $position={"relative"}
      $overflow={"hidden"}
    >
      <OakFlex $height="all-spacing-1" $position="relative">
        <OakSvg
          name="header-underline"
          $position={"absolute"}
          $left={"all-spacing-0"}
          $top={"all-spacing-0"}
        />
      </OakFlex>
      <nav>
        <OakMaxWidth
          $pt={["inner-padding-m", "inner-padding-xl8"]}
          $justifyContent={"center"}
          $flexDirection={"column"}
          $ph={"inner-padding-m"}
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
              <OakBox $mt={["space-between-none", "space-between-m2"]} />
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
                <OakBox $display={["none", "block"]}>
                  <Logo variant="with text" height={66} width={150} />
                </OakBox>
                <SocialButtons
                  $display={["flex", "none"]}
                  for="Oak National Academy"
                  {...OAK_SOCIALS}
                />
              </OakFlex>
            </OakGridArea>
          </OakGrid>
          <StyledLogo
            alt="Cyber Essentials Logo"
            src={getCloudinaryImageUrl(
              "v1751992190/OWA/illustrations/Cyber-Essentials-Logo_ryiskg.png",
            )}
          />
          <OakFlex
            $mb="space-between-xl"
            $mt={"space-between-m2"}
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
            <OakBox $display={["block", "none"]}>
              <Logo variant="with text" height={66} width={150} />
            </OakBox>
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
        </OakMaxWidth>
      </nav>
      <OakIcon
        iconName="looping-line-3"
        $colorFilter={"mint"}
        $zIndex={"behind"}
        $display={["none", "block"]}
        $objectFit={"fill"}
        $transform={[
          "none",
          "translate(25%, 25%) scale(0.7) rotate(-10deg)",
          "translate(25%, 15%) rotate(-10deg)",
        ]}
        $position={"absolute"}
        $left={"all-spacing-0"}
        $right={"all-spacing-0"}
        $top={"all-spacing-0"}
        $bottom={"all-spacing-0"}
        $width={"100%"}
        $height={"100%"}
      />
      <OakIcon
        iconName="looping-line-4"
        $colorFilter={"pink50"}
        $zIndex={"behind"}
        $display={["block", "none"]}
        $objectFit={"fill"}
        $transform={"translate(0%, 32%)"}
        $position={"absolute"}
        $left={"all-spacing-0"}
        $right={"all-spacing-0"}
        $top={"all-spacing-0"}
        $bottom={"all-spacing-0"}
        $width={"100%"}
        $height={"100%"}
      />
    </OakBox>
  );
};

export default LayoutSiteFooter;
