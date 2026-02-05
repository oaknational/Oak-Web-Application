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
import {
  ProfileNavigation,
  MemberCategory,
  buildProfileNavigation,
  determineMemberSection,
  getMemberCategory,
} from "@/pages-helpers/shared/about-us-pages/profileNavigation";
import { trimTrailingEmptyBlocks } from "@/utils/portableText/trimEmptyBlocks";
import getProxiedSanityAssetUrl from "@/common-lib/urls/getProxiedSanityAssetUrl";

const posthogApiKey = getBrowserConfig("posthogApiKey");

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
  const trimmedBio = trimTrailingEmptyBlocks(bioPortableText);
  const imageUrl = getProxiedSanityAssetUrl(image?.asset?.url);

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
            {imageUrl && (
              <OakBox $display={["none", "block"]}>
                <OakBox $borderRadius={"border-radius-l"} $overflow={"hidden"}>
                  <OakImage
                    src={imageUrl}
                    alt={image?.altText ?? ""}
                    $width={"100%"}
                    $aspectRatio={"2/3"}
                    $objectFit={"cover"}
                    style={{ objectPosition: "center" }}
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
              {imageUrl && (
                <OakBox $display={["block", "none"]} style={{ width: "75%" }}>
                  <OakBox
                    $borderRadius={"border-radius-l"}
                    $overflow={"hidden"}
                  >
                    <OakImage
                      src={imageUrl}
                      alt={image?.altText ?? ""}
                      $width={"100%"}
                      $aspectRatio={"2/3"}
                      $objectFit={"cover"}
                      style={{ objectPosition: "center" }}
                    />
                  </OakBox>
                </OakBox>
              )}

              {/* Socials */}
              {socials && (socials.twitterUsername || socials.linkedinUrl) && (
                <OakFlex
                  $gap={"spacing-12"}
                  style={{ width: "fit-content" }}
                  aria-label={`${name}'s social media links`}
                  role="group"
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

              {/* Bio */}
              {trimmedBio && (
                <OakBox $font={["body-2", "body-1"]} $color={"text-primary"}>
                  <PortableTextWithDefaults value={trimmedBio} />
                </OakBox>
              )}

              {/* Navigation buttons */}
              {(prevHref || nextHref) && (
                <OakFlex
                  as="nav"
                  $gap={"spacing-16"}
                  aria-label="Team member navigation"
                >
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

export const getServerSideProps: GetServerSideProps<
  AboutUsMeetTheTeamPersonPageProps,
  URLParams
> = async (context) => {
  const posthogUserId = getPosthogIdFromCookie(
    context.req.cookies,
    posthogApiKey,
  );
  let enableV2: boolean = false;
  if (posthogUserId) {
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
