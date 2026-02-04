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
        <OakGrid $cg={["spacing-0", "spacing-16"]}>
          {/* Header content - category, name, job title (mobile: first/stacked, tablet+: after image/side-by-side) */}
          <OakGridArea $colSpan={[12, 5, 8]} $order={[1, 2]}>
            <OakFlex
              $flexDirection={"column"}
              $ph={["spacing-0", "spacing-40"]}
            >
              <OakTypography $font={"heading-light-6"} $color={"text-primary"}>
                {category}
              </OakTypography>

              <OakHeading tag="h1" $font={"heading-2"} $mt={"spacing-4"}>
                {name}
              </OakHeading>

              {role && (
                <OakBox
                  $mt={"spacing-24"}
                  $background={"lemon"}
                  $ph={"spacing-4"}
                  style={{ width: "fit-content" }}
                >
                  <OakTypography $font={"heading-light-4"}>
                    {role}
                  </OakTypography>
                </OakBox>
              )}
            </OakFlex>
          </OakGridArea>

          {/* Image (mobile: 4 cols stacked, tablet: 3 cols, desktop: 4 cols side-by-side) */}
          <OakGridArea $colSpan={[4, 3, 4]} $order={[2, 1]} $rowSpan={[1, 2]}>
            {image?.asset?.url && (
              <OakBox
                $borderRadius={"border-radius-l"}
                $overflow={"hidden"}
                $mt={["spacing-24", "spacing-0"]}
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
            )}
          </OakGridArea>

          {/* Body content - socials, bio, navigation */}
          <OakGridArea $colSpan={[12, 5, 8]} $order={[3, 3]}>
            <OakFlex
              $flexDirection={"column"}
              $ph={["spacing-0", "spacing-40"]}
            >
              {socials && (socials.twitterUsername || socials.linkedinUrl) && (
                <OakFlex
                  $mt={"spacing-24"}
                  $gap={"spacing-12"}
                  style={{ width: "fit-content" }}
                >
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

              {bioPortableText && (
                <OakBox
                  $font={"body-1"}
                  $color={"text-subdued"}
                  $mt={"spacing-24"}
                >
                  <PortableTextWithDefaults value={bioPortableText} />
                </OakBox>
              )}

              {(prevHref || nextHref) && (
                <OakFlex $gap={"spacing-16"} $mt={"spacing-40"}>
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

function buildProfileNavigation(
  leadershipTeam: TeamMemberRef[],
  boardMembers: TeamMemberRef[],
  currentSlug: string,
  currentSection: MemberSection,
): ProfileNavigation {
  // Get the appropriate member list based on section
  const currentList =
    currentSection === "leadership" ? leadershipTeam : boardMembers;
  const otherList =
    currentSection === "leadership" ? boardMembers : leadershipTeam;
  const otherSection: MemberSection =
    currentSection === "leadership" ? "board" : "leadership";

  const currentIndex = currentList.findIndex(
    (member) => getMemberSlug(member) === currentSlug,
  );

  if (currentIndex === -1) {
    // Member not found in current section
    return { prevHref: null, prevName: null, nextHref: null, nextName: null };
  }

  let prevHref: string | null = null;
  let prevName: string | null = null;
  let nextHref: string | null = null;
  let nextName: string | null = null;

  // Calculate previous navigation
  if (currentIndex > 0) {
    // Previous member in same section
    const prevMember = currentList[currentIndex - 1];
    if (prevMember) {
      prevHref = buildMemberHref(getMemberSlug(prevMember), currentSection);
      prevName = prevMember.name;
    }
  } else if (otherList.length > 0) {
    // Wrap to last member of other section
    const lastOther = otherList[otherList.length - 1];
    if (lastOther) {
      prevHref = buildMemberHref(getMemberSlug(lastOther), otherSection);
      prevName = lastOther.name;
    }
  } else if (currentList.length > 1) {
    // Wrap to last member of same section
    const lastSame = currentList[currentList.length - 1];
    if (lastSame) {
      prevHref = buildMemberHref(getMemberSlug(lastSame), currentSection);
      prevName = lastSame.name;
    }
  }

  // Calculate next navigation
  if (currentIndex < currentList.length - 1) {
    // Next member in same section
    const nextMember = currentList[currentIndex + 1];
    if (nextMember) {
      nextHref = buildMemberHref(getMemberSlug(nextMember), currentSection);
      nextName = nextMember.name;
    }
  } else if (otherList.length > 0) {
    // Wrap to first member of other section
    const firstOther = otherList[0];
    if (firstOther) {
      nextHref = buildMemberHref(getMemberSlug(firstOther), otherSection);
      nextName = firstOther.name;
    }
  } else if (currentList.length > 1) {
    // Wrap to first member of same section
    const firstSame = currentList[0];
    if (firstSame) {
      nextHref = buildMemberHref(getMemberSlug(firstSame), currentSection);
      nextName = firstSame.name;
    }
  }

  return { prevHref, prevName, nextHref, nextName };
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
