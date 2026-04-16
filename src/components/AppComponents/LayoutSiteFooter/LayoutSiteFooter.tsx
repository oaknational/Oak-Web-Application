"use client";
import { FC } from "react";
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
  OakSecondaryLink,
} from "@oaknational/oak-components";
import styled from "styled-components";
import Link from "next/link";

import { aboutUsAccessed } from "@/browser-lib/avo/Avo";
import { OAK_SOCIALS } from "@/components/SharedComponents/SocialButtons/SocialButtons";
import SocialButtons from "@/components/SharedComponents/SocialButtons";
import useAnalytics from "@/context/Analytics/useAnalytics";
import { toSentenceCase } from "@/node-lib/curriculum-api-2023/helpers";
import { buildAboutUsAnalytics } from "@/utils/analytics-builders";
import { getCloudinaryImageUrl } from "@/utils/getCloudinaryImageUrl";
import { resolveOakHref } from "@/common-lib/urls";

const trackAboutUsFooter = () =>
  aboutUsAccessed(buildAboutUsAnalytics("about_us_footer"));

const footerSections: FooterSections = {
  pupils: {
    title: "Pupils",
    links: [
      {
        text: "Learn online",
        type: "link",
        href: resolveOakHref({ page: "pupil-year-index" }),
      },
    ],
  },
  teachers: {
    title: "Teachers",
    links: [
      {
        text: "EYFS",
        type: "link",
        href: resolveOakHref({
          page: "eyfs-page",
          subjectSlug: "maths",
        }),
      },
      {
        text: "Specialist",
        type: "link",
        href: "/teachers/specialist/subjects",
      },
      {
        text: "Key stage 1",
        type: "link",
        href: resolveOakHref({ page: "subject-index", keyStageSlug: "ks1" }),
      },
      {
        text: "Key stage 2",
        type: "link",
        href: resolveOakHref({ page: "subject-index", keyStageSlug: "ks2" }),
      },
      {
        text: "Key stage 3",
        type: "link",
        href: resolveOakHref({ page: "subject-index", keyStageSlug: "ks3" }),
      },
      {
        text: "Key stage 4",
        type: "link",
        href: resolveOakHref({ page: "subject-index", keyStageSlug: "ks4" }),
      },
      {
        text: "Plan a lesson",
        type: "link",
        href: resolveOakHref({ page: "lesson-planning" }),
      },
    ],
  },
  oak: {
    title: "Oak",
    links: [
      { text: "Home", type: "link", href: resolveOakHref({ page: "home" }) },
      {
        text: "About us",
        type: "link",
        href: resolveOakHref({ page: "about-who-we-are" }),
        track: trackAboutUsFooter,
      },
      {
        text: "Oak's curricula",
        type: "link",
        href: resolveOakHref({ page: "about-oaks-curricula" }),
        track: trackAboutUsFooter,
      },
      {
        text: "Get involved",
        type: "link",
        href: resolveOakHref({ page: "about-get-involved" }),
        track: trackAboutUsFooter,
      },
      {
        text: "Meet the team",
        type: "link",
        href: resolveOakHref({ page: "about-meet-the-team" }),
        track: trackAboutUsFooter,
      },
      {
        text: "Careers",
        type: "link",
        href: "https://jobs.thenational.academy",
        icon: "external",
        ariaLabel: "Careers (opens in a new tab)",
      },
      {
        text: "Contact us",
        type: "link",
        href: resolveOakHref({ page: "contact" }),
      },
      {
        text: "Help",
        type: "link",
        href: resolveOakHref({ page: "help" }),
        icon: "external",
        ariaLabel: "Help (opens in a new tab)",
      },
      {
        text: "Blog",
        type: "link",
        href: resolveOakHref({ page: "blog-index" }),
      },
      {
        text: "Webinars",
        type: "link",
        href: resolveOakHref({ page: "webinar-index" }),
      },
      {
        text: "Status",
        href: "https://status.thenational.academy",
        icon: "external",
        type: "link",
        ariaLabel: "Status (opens in a new tab)",
      },
    ],
  },

  legal: {
    title: "Legal",
    links: [
      {
        text: "Terms & conditions",
        type: "link",
        href: "/legal/terms-and-conditions",
      },
      { text: "Privacy policy", type: "link", href: "/legal/privacy-policy" },
      { text: "Cookie policy", type: "link", href: "/legal/cookie-policy" },
      { text: "Manage cookie settings", type: "consent-manager-toggle" },

      {
        text: "Copyright notice",
        type: "link",
        href: "/legal/copyright-notice",
      },
      {
        text: "Accessibility statement",
        type: "link",
        href: "/legal/accessibility-statement",
      },
      {
        text: "Safeguarding statement",
        type: "link",
        href: "/legal/safeguarding-statement",
      },
      {
        text: "Physical activity disclaimer",
        type: "link",
        href: "/legal/physical-activity-disclaimer",
      },
      { text: "Complaints", type: "link", href: "/legal/complaints" },
      {
        text: "Freedom of information requests",
        type: "link",
        href: "/legal/freedom-of-information-requests",
      },
    ],
  },
};

type LayoutFooterLinkProps = {
  text: string;
  icon?: OakIconName;
  ariaLabel?: string;
  track?: () => void;
} & (
  | {
      href: string;
      type: "link";
    }
  | {
      type: "consent-manager-toggle";
    }
);

const FooterLink: FC<LayoutFooterLinkProps> = (props) => {
  const { track } = useAnalytics();
  const { openSettings } = useCookieConsent();

  if (props.type === "consent-manager-toggle") {
    return (
      <OakSecondaryLink element="button" onClick={openSettings}>
        {props.text}
      </OakSecondaryLink>
    );
  }

  return (
    <OakSecondaryLink
      href={props.href}
      element={Link}
      aria-label={props.ariaLabel ?? undefined}
      iconName={props.icon}
      isTrailingIcon
      target={props.icon === "external" ? "_blank" : undefined}
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
            googleLoginHint: null,
            clientEnvironment: null,
          });
        }

        if (props.track) {
          props.track();
        }
      }}
    >
      {props.text}
    </OakSecondaryLink>
  );
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
    <OakFlex $flexDirection="column" $mt={["spacing-32", "spacing-0"]}>
      <OakHeading
        $mb="spacing-8"
        $font="heading-7"
        $color="text-primary"
        tag="h2"
      >
        {title}
      </OakHeading>
      <OakTypography $color={"text-primary"} $font={"body-2"}>
        {/* Note: Anything with `list-style: none` (or similar) gets treated by Safari as not-a-list, so we have to add the role here */}
        <ul role="list">
          {links.map((link) => (
            <OakLI key={link.text} $mt="spacing-12">
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

  return (
    <OakBox
      as="footer"
      $zIndex="neutral"
      $width="100%"
      $background="bg-primary"
      $position={"relative"}
      $overflow={"hidden"}
    >
      <OakFlex $height="spacing-4" $position="relative">
        <OakSvg
          name="header-underline"
          $position={"absolute"}
          $left={"spacing-0"}
          $top={"spacing-0"}
        />
      </OakFlex>
      <nav id="site-footer">
        <OakMaxWidth
          $pt={["spacing-16", "spacing-80"]}
          $justifyContent={"center"}
          $flexDirection={"column"}
          $ph={"spacing-16"}
          $ma={"auto"}
          $width={"100%"}
        >
          <OakGrid>
            <OakGridArea $colSpan={[12, 3]}>
              <FooterSectionLinks {...sections.pupils} />
              <OakBox $mt={["spacing-0", "spacing-32"]} />
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
                $mt={["spacing-32", "spacing-0"]}
              >
                <OakBox $display={["none", "block"]}>
                  <OakImage
                    src={getCloudinaryImageUrl(
                      "v1765468420/OakLogoWithText.svg",
                    )}
                    alt=""
                    $height={"spacing-64"}
                    $width={"spacing-160"}
                    $pa={"spacing-0"}
                  />
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
            data-percy-hide="contents"
            src={getCloudinaryImageUrl(
              "v1751992190/OWA/illustrations/Cyber-Essentials-Logo_ryiskg.png",
            )}
          />
          <OakFlex
            $mb="spacing-56"
            $mt={"spacing-32"}
            $width={"100%"}
            $justifyContent={["flex-start", "space-between"]}
            $flexDirection={["column", "row"]}
            $alignItems={["flex-start", "center"]}
            $pt={["spacing-12", "spacing-0"]}
          >
            <SocialButtons
              $display={["none", "flex"]}
              for="Oak National Academy"
              {...OAK_SOCIALS}
            />
            <OakBox $display={["block", "none"]}>
              <OakImage
                src={getCloudinaryImageUrl("v1765468420/OakLogoWithText.svg")}
                alt=""
                $height={"spacing-64"}
                $width={"spacing-160"}
                $pa={"spacing-0"}
              />
            </OakBox>
            <OakFlex
              $mt={["spacing-32", "spacing-0"]}
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
        $colorFilter={"bg-decorative1-main"}
        $zIndex={"behind"}
        $display={["none", "block"]}
        $objectFit={"fill"}
        $transform={[
          "none",
          "translate(25%, 25%) scale(0.7) rotate(-10deg)",
          "translate(25%, 15%) rotate(-10deg)",
        ]}
        $position={"absolute"}
        $left={"spacing-0"}
        $right={"spacing-0"}
        $top={"spacing-0"}
        $bottom={"spacing-0"}
        $width={"100%"}
        $height={"100%"}
      />
      <OakIcon
        iconName="looping-line-4"
        $colorFilter={"bg-decorative4-subdued"}
        $zIndex={"behind"}
        $display={["block", "none"]}
        $objectFit={"fill"}
        $transform={"translate(0%, 32%)"}
        $position={"absolute"}
        $left={"spacing-0"}
        $right={"spacing-0"}
        $top={"spacing-0"}
        $bottom={"spacing-0"}
        $width={"100%"}
        $height={"100%"}
      />
    </OakBox>
  );
};

export default LayoutSiteFooter;
