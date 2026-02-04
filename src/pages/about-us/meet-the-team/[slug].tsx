import { NextPage, GetServerSideProps } from "next";
import {
  OakFlex,
  OakGrid,
  OakGridArea,
  OakHeading,
  OakImage,
  OakMaxWidth,
  OakTypography,
  OakBox,
  OakSmallSecondaryButton,
} from "@oaknational/oak-components";

import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import Layout from "@/components/AppComponents/Layout";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { TopNavProps } from "@/components/AppComponents/TopNav/TopNav";
import { getPosthogIdFromCookie } from "@/node-lib/posthog/getPosthogId";
import { getFeatureFlag } from "@/node-lib/posthog/getFeatureFlag";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import CMSClient from "@/node-lib/cms";
import { TeamMember } from "@/common-lib/cms-types/teamMember";
import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";
import { SocialButton } from "@/components/GenericPagesComponents/SocialButton";

const posthogApiKey = getBrowserConfig("posthogApiKey");

type ProfileNavigation = {
  prevHref: string | null;
  prevName: string | null;
  nextHref: string | null;
  nextName: string | null;
};

type MemberCategory = "Our leadership" | "Our board";
type MemberSection = "leadership" | "board";

export type AboutUsMeetTheTeamPersonPageProps = {
  pageData: TeamMember;
  topNav: TopNavProps;
  navigation: ProfileNavigation;
  category: MemberCategory;
};

const AboutUsMeetTheTeamPerson: NextPage<AboutUsMeetTheTeamPersonPageProps> = ({
  pageData,
  topNav,
  navigation,
  category,
}) => {
  const { name, role, image, bioPortableText, socials } = pageData;
  const { prevHref, nextHref } = navigation;

  return (
    <Layout
      seoProps={getSeoProps({
        title: `${name} - Meet the Team | Oak National Academy`,
        description: role ?? undefined,
      })}
      $background={"bg-primary"}
      topNavProps={topNav}
    >
      <OakMaxWidth
        $mb={["spacing-56", "spacing-80"]}
        $mt={["spacing-56", "spacing-80"]}
        $ph={["spacing-16", "spacing-32"]}
      >
        <OakGrid $cg={["spacing-0", "spacing-16"]} $rg={"spacing-24"}>
          {/* Image - Desktop/Tablet only (left column) */}
          <OakGridArea $colSpan={[12, 5, 4]} $order={1}>
            {image?.asset?.url && (
              <OakBox $display={["none", "block"]}>
                <OakBox $borderRadius={"border-radius-l"} $overflow={"hidden"}>
                  <OakImage
                    src={image.asset.url}
                    alt={image.altText ?? `Photo of ${name}`}
                    $width={"100%"}
                    $aspectRatio={"2/3"}
                    $objectFit={"cover"}
                    $objectPosition={"center"}
                  />
                </OakBox>
              </OakBox>
            )}
          </OakGridArea>

          {/* All text content (right column on desktop, full width on mobile) */}
          <OakGridArea $colSpan={[12, 7, 8]} $order={2}>
            <OakFlex
              $flexDirection={"column"}
              $ph={["spacing-0", "spacing-40"]}
              $gap={"spacing-24"}
            >
              {/* Header group - category, name, job title */}
              <OakFlex $flexDirection={"column"} $gap={"spacing-24"}>
                {/* Category + Name */}
                <OakFlex $flexDirection={"column"} $gap={"spacing-4"}>
                  <OakTypography
                    $font={["heading-light-7", "heading-light-6"]}
                    $color={"text-primary"}
                  >
                    {category}
                  </OakTypography>
                  <OakHeading
                    tag="h1"
                    $font={["heading-3", "heading-2"]}
                    $color={"text-primary"}
                  >
                    {name}
                  </OakHeading>
                </OakFlex>

                {/* Job title */}
                {role && (
                  <OakBox
                    $background={"lemon"}
                    $ph={"spacing-4"}
                    style={{ width: "fit-content" }}
                  >
                    <OakTypography
                      $font={["heading-light-5", "heading-light-4"]}
                    >
                      {role}
                    </OakTypography>
                  </OakBox>
                )}
              </OakFlex>

              {/* Image - Mobile only (between header and socials) */}
              {image?.asset?.url && (
                <OakBox $display={["block", "none"]} $width={"75%"}>
                  <OakBox
                    $borderRadius={"border-radius-l"}
                    $overflow={"hidden"}
                  >
                    <OakImage
                      src={image.asset.url}
                      alt={image.altText ?? `Photo of ${name}`}
                      $width={"100%"}
                      $aspectRatio={"2/3"}
                      $objectFit={"cover"}
                      $objectPosition={"center"}
                    />
                  </OakBox>
                </OakBox>
              )}

              {/* Socials */}
              {socials && (socials.twitterUsername || socials.linkedinUrl) && (
                <OakFlex $gap={"spacing-12"} style={{ width: "fit-content" }}>
                  {socials.linkedinUrl && (
                    <SocialButton
                      socialType="linkedin"
                      profileHref={socials.linkedinUrl}
                    />
                  )}
                  {socials.twitterUsername && (
                    <SocialButton
                      socialType="x"
                      profileHref={`https://x.com/${socials.twitterUsername}`}
                    />
                  )}
                </OakFlex>
              )}

              {/* Bio */}
              {bioPortableText && (
                <OakBox $font={["body-2", "body-1"]} $color={"text-primary"}>
                  <PortableTextWithDefaults value={bioPortableText} />
                </OakBox>
              )}

              {/* Navigation buttons */}
              {(prevHref || nextHref) && (
                <OakFlex $gap={"spacing-16"} $mt={"spacing-16"}>
                  {prevHref && (
                    <OakSmallSecondaryButton
                      element="a"
                      href={prevHref}
                      iconName="arrow-left"
                    >
                      Previous profile
                    </OakSmallSecondaryButton>
                  )}
                  {nextHref && (
                    <OakSmallSecondaryButton
                      element="a"
                      href={nextHref}
                      iconName="arrow-right"
                      isTrailingIcon
                    >
                      Next profile
                    </OakSmallSecondaryButton>
                  )}
                </OakFlex>
              )}
            </OakFlex>
          </OakGridArea>
        </OakGrid>
      </OakMaxWidth>
    </Layout>
  );
};

type URLParams = {
  slug: string;
};

type TeamMemberRef = {
  id: string;
  name: string;
  slug?: { current?: string } | null;
};

function getMemberSlug(member: TeamMemberRef): string {
  return member.slug?.current ?? member.id;
}

function buildMemberHref(slug: string, section: MemberSection): string {
  return `/about-us/meet-the-team/${slug}?section=${section}`;
}

function getNeighbor(
  currentList: TeamMemberRef[],
  otherList: TeamMemberRef[],
  currentIndex: number,
  currentSection: MemberSection,
  direction: "prev" | "next",
): { href: string | null; name: string | null } {
  const otherSection: MemberSection =
    currentSection === "leadership" ? "board" : "leadership";
  const atBoundary =
    direction === "prev"
      ? currentIndex === 0
      : currentIndex === currentList.length - 1;

  // Not at boundary - return neighbor in same section
  if (!atBoundary) {
    const neighbor =
      currentList[currentIndex + (direction === "prev" ? -1 : 1)];
    if (neighbor) {
      return {
        href: buildMemberHref(getMemberSlug(neighbor), currentSection),
        name: neighbor.name,
      };
    }
  }

  // At boundary - wrap to other section if it has members
  if (otherList.length > 0) {
    const wrap = direction === "prev" ? otherList.at(-1) : otherList[0];
    if (wrap) {
      return {
        href: buildMemberHref(getMemberSlug(wrap), otherSection),
        name: wrap.name,
      };
    }
  }

  // Other section empty - wrap within same section if more than one member
  if (currentList.length > 1) {
    const wrap = direction === "prev" ? currentList.at(-1) : currentList[0];
    if (wrap) {
      return {
        href: buildMemberHref(getMemberSlug(wrap), currentSection),
        name: wrap.name,
      };
    }
  }

  return { href: null, name: null };
}

function buildProfileNavigation(
  leadershipTeam: TeamMemberRef[],
  boardMembers: TeamMemberRef[],
  currentSlug: string,
  currentSection: MemberSection,
): ProfileNavigation {
  const currentList =
    currentSection === "leadership" ? leadershipTeam : boardMembers;
  const otherList =
    currentSection === "leadership" ? boardMembers : leadershipTeam;

  const currentIndex = currentList.findIndex(
    (member) => getMemberSlug(member) === currentSlug,
  );

  if (currentIndex === -1) {
    return { prevHref: null, prevName: null, nextHref: null, nextName: null };
  }

  const prev = getNeighbor(
    currentList,
    otherList,
    currentIndex,
    currentSection,
    "prev",
  );
  const next = getNeighbor(
    currentList,
    otherList,
    currentIndex,
    currentSection,
    "next",
  );

  return {
    prevHref: prev.href,
    prevName: prev.name,
    nextHref: next.href,
    nextName: next.name,
  };
}

function determineMemberSection(
  leadershipTeam: TeamMemberRef[],
  boardMembers: TeamMemberRef[],
  currentSlug: string,
  requestedSection: MemberSection | null,
): MemberSection {
  const inLeadership = leadershipTeam.some(
    (member) => getMemberSlug(member) === currentSlug,
  );
  const inBoard = boardMembers.some(
    (member) => getMemberSlug(member) === currentSlug,
  );

  // If a section was requested and the member exists in that section, use it
  if (requestedSection === "leadership" && inLeadership) return "leadership";
  if (requestedSection === "board" && inBoard) return "board";

  // Default: prefer leadership if member is in both
  if (inLeadership) return "leadership";
  return "board";
}

function getMemberCategory(section: MemberSection): MemberCategory {
  return section === "leadership" ? "Our leadership" : "Our board";
}

export const getServerSideProps: GetServerSideProps<
  AboutUsMeetTheTeamPersonPageProps,
  URLParams
> = async (context) => {
  const posthogUserId = getPosthogIdFromCookie(
    context.req.cookies,
    posthogApiKey,
  );
  let enableV2: boolean = true; // Temporarily enabled for development
  if (posthogUserId && !enableV2) {
    enableV2 =
      (await getFeatureFlag({
        featureFlagKey: "about-us--who-we-are--v2",
        posthogUserId,
      })) === true;
  }

  if (!enableV2) {
    return { notFound: true };
  }

  const slug = context.params?.slug;
  if (!slug) {
    return { notFound: true };
  }

  const isPreviewMode = context.preview === true;

  const [teamMember, meetTheTeamPage, topNav] = await Promise.all([
    CMSClient.teamMemberBySlug(slug, { previewMode: isPreviewMode }),
    CMSClient.meetTheTeamPage({ previewMode: isPreviewMode }),
    curriculumApi2023.topNav(),
  ]);

  if (!teamMember) {
    return { notFound: true };
  }

  const leadershipTeam = meetTheTeamPage?.leadershipTeam ?? [];
  const boardMembers = meetTheTeamPage?.boardMembers ?? [];

  // Get section from query param (if provided)
  const requestedSection =
    context.query.section === "leadership" || context.query.section === "board"
      ? context.query.section
      : null;

  const section = determineMemberSection(
    leadershipTeam,
    boardMembers,
    slug,
    requestedSection,
  );
  const navigation = buildProfileNavigation(
    leadershipTeam,
    boardMembers,
    slug,
    section,
  );
  const category = getMemberCategory(section);

  return {
    props: {
      pageData: teamMember,
      topNav,
      navigation,
      category,
    },
  };
};

export default AboutUsMeetTheTeamPerson;
