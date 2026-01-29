import { NextPage, GetServerSideProps } from "next";
import {
  OakFlex,
  OakHeading,
  OakImage,
  OakMaxWidth,
  OakTypography,
  OakBox,
  OakSecondaryLink,
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

const posthogApiKey = getBrowserConfig("posthogApiKey");

type ProfileNavigation = {
  prevSlug: string | null;
  prevName: string | null;
  nextSlug: string | null;
  nextName: string | null;
};

export type AboutUsMeetTheTeamPersonPageProps = {
  pageData: TeamMember;
  topNav: TopNavProps;
  navigation: ProfileNavigation;
};

const AboutUsMeetTheTeamPerson: NextPage<AboutUsMeetTheTeamPersonPageProps> = ({
  pageData,
  topNav,
  navigation,
}) => {
  const { name, role, image, bioPortableText, socials } = pageData;
  const { prevSlug, nextSlug } = navigation;

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
        <OakBox $mb={"spacing-24"}>
          <OakSecondaryLink
            href="/about-us/meet-the-team"
            iconName="arrow-left"
          >
            Back to Meet the Team
          </OakSecondaryLink>
        </OakBox>

        <OakFlex
          $flexDirection={["column", "row"]}
          $gap={["spacing-32", "spacing-56"]}
        >
          {image?.asset?.url && (
            <OakBox
              $width={["100%", "spacing-240"]}
              $minWidth={["auto", "spacing-240"]}
            >
              <OakImage
                src={image.asset.url}
                alt={image.altText ?? `Photo of ${name}`}
                $width={"100%"}
                $aspectRatio={"1/1"}
                $objectFit={"cover"}
                $borderRadius={"border-radius-m"}
              />
            </OakBox>
          )}

          <OakFlex $flexDirection={"column"} $gap={"spacing-16"} $flexGrow={1}>
            <OakHeading tag="h1" $font={["heading-4", "heading-3"]}>
              {name}
            </OakHeading>

            {role && (
              <OakTypography $font={"heading-6"} $color={"text-subdued"}>
                {role}
              </OakTypography>
            )}

            {socials && (socials.twitterUsername || socials.linkedinUrl) && (
              <OakFlex $gap={"spacing-16"} $mt={"spacing-8"}>
                {socials.twitterUsername && (
                  <OakSecondaryLink
                    href={`https://twitter.com/${socials.twitterUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Twitter
                  </OakSecondaryLink>
                )}
                {socials.linkedinUrl && (
                  <OakSecondaryLink
                    href={socials.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                  </OakSecondaryLink>
                )}
              </OakFlex>
            )}

            {bioPortableText && (
              <OakTypography $font={["body-1", "body-2"]} $mt={"spacing-16"}>
                <PortableTextWithDefaults
                  value={bioPortableText}
                  withoutDefaultComponents
                />
              </OakTypography>
            )}
          </OakFlex>
        </OakFlex>

        {(prevSlug || nextSlug) && (
          <OakFlex $gap={"spacing-16"} $mt={["spacing-32", "spacing-56"]}>
            {prevSlug && (
              <OakBox
                $borderColor={"border-neutral-lighter"}
                $ba={"border-solid-s"}
                $borderRadius={"border-radius-s"}
                $pa={"spacing-12"}
              >
                <OakSecondaryLink
                  href={`/about-us/meet-the-team/${prevSlug}`}
                  iconName="arrow-left"
                >
                  Previous profile
                </OakSecondaryLink>
              </OakBox>
            )}
            {nextSlug && (
              <OakBox
                $borderColor={"border-neutral-lighter"}
                $ba={"border-solid-s"}
                $borderRadius={"border-radius-s"}
                $pa={"spacing-12"}
              >
                <OakSecondaryLink
                  href={`/about-us/meet-the-team/${nextSlug}`}
                  iconName="arrow-right"
                  isTrailingIcon
                >
                  Next profile
                </OakSecondaryLink>
              </OakBox>
            )}
          </OakFlex>
        )}
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

function buildProfileNavigation(
  allMembers: TeamMemberRef[],
  currentSlug: string,
): ProfileNavigation {
  const currentIndex = allMembers.findIndex(
    (member) => getMemberSlug(member) === currentSlug,
  );

  if (currentIndex === -1) {
    return { prevSlug: null, prevName: null, nextSlug: null, nextName: null };
  }

  const prevMember = allMembers[currentIndex - 1];
  const nextMember = allMembers[currentIndex + 1];

  return {
    prevSlug: prevMember ? getMemberSlug(prevMember) : null,
    prevName: prevMember?.name ?? null,
    nextSlug: nextMember ? getMemberSlug(nextMember) : null,
    nextName: nextMember?.name ?? null,
  };
}

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

  const allMembers = [
    ...(meetTheTeamPage?.leadershipTeam ?? []),
    ...(meetTheTeamPage?.boardMembers ?? []),
  ];
  const navigation = buildProfileNavigation(allMembers, slug);

  return {
    props: {
      pageData: teamMember,
      topNav,
      navigation,
    },
  };
};

export default AboutUsMeetTheTeamPerson;
