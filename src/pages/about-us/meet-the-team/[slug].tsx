import { NextPage, GetServerSideProps } from "next";
import { useRouter } from "next/router";
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
import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import CMSClient from "@/node-lib/cms";
import { TeamMember } from "@/common-lib/cms-types/teamMember";
import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";
import { SocialButton } from "@/components/GenericPagesComponents/SocialButton";
import Breadcrumbs, {
  Breadcrumb,
} from "@/components/SharedComponents/Breadcrumbs";
import {
  ProfileNavigation,
  MemberCategory,
  buildProfileNavigation,
  determineMemberSection,
  getMemberCategory,
} from "@/pages-helpers/shared/about-us-pages/profileNavigation";
import { trimTrailingEmptyBlocks } from "@/utils/portableText/trimEmptyBlocks";
import getProxiedSanityAssetUrl from "@/common-lib/urls/getProxiedSanityAssetUrl";
import isNewAboutUsPagesEnabled from "@/utils/isNewAboutUsPagesEnabled";

const posthogApiKey = getBrowserConfig("posthogApiKey");

export type AboutUsMeetTheTeamPersonPageProps = {
  pageData: TeamMember;
  topNav: TopNavProps;
  navigation: ProfileNavigation;
  category: MemberCategory;
};

const ProfileLinkButton: React.FC<{
  href: string;
  iconName: "arrow-left" | "arrow-right";
  isTrailingIcon?: boolean;
  children: React.ReactNode;
}> = ({ href, iconName, isTrailingIcon, children }) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    router.replace(href);
  };

  return (
    <OakSmallSecondaryButton
      element="a"
      href={href}
      iconName={iconName}
      isTrailingIcon={isTrailingIcon}
      onClick={handleClick}
    >
      {children}
    </OakSmallSecondaryButton>
  );
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

  const breadcrumbs: Breadcrumb[] = [
    { label: "Home", oakLinkProps: { page: "home" } },
    {
      label: "Meet the team",
      oakLinkProps: { page: null, href: "/about-us/meet-the-team" },
    },
    {
      label: name,
      oakLinkProps: { page: null, href: "#" },
      disabled: true,
    },
  ];

  return (
    <Layout
      seoProps={getSeoProps({
        title: `${name} - Meet the Team | Oak National Academy`,
        description: role ?? undefined,
      })}
      $background={"bg-primary"}
      topNavProps={topNav}
    >
      <OakMaxWidth $ph={["spacing-16", "spacing-40"]} $pt={"spacing-24"} $color={"text-primary"}>
        <Breadcrumbs breadcrumbs={breadcrumbs} />
      </OakMaxWidth>
      <OakMaxWidth
        $mb={["spacing-56", "spacing-80"]}
        $mt={["spacing-48", "spacing-56"]}
        $ph={["spacing-16", "spacing-40"]}
      >
        <OakGrid $cg={["spacing-0", "spacing-16"]} $rg={"spacing-24"}>
          {/* Image - Desktop/Tablet only (left column) */}
          <OakGridArea
            $colSpan={[12, 4]}
            $order={1}
            $display={["none", "block"]}
          >
            {imageUrl && (
              <OakBox>
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
          <OakGridArea $colSpan={[12, 8]} $order={2}>
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
                    $background={"bg-decorative5-main"}
                    $color={"text-primary"}
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
                <OakBox $font={["body-2", "body-1"]} $color={"text-primary"} $pb={"spacing-16"}>
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
                    <ProfileLinkButton href={prevHref} iconName="arrow-left">
                      Previous profile
                    </ProfileLinkButton>
                  )}
                  {nextHref && (
                    <ProfileLinkButton
                      href={nextHref}
                      iconName="arrow-right"
                      isTrailingIcon
                    >
                      Next profile
                    </ProfileLinkButton>
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
  const enableV2 = await isNewAboutUsPagesEnabled(
    posthogApiKey,
    context.req.cookies,
  );

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
