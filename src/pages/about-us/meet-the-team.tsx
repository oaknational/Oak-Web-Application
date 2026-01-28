import { NextPage, GetStaticPropsResult, GetServerSideProps } from "next";
import {
  OakFlex,
  OakHeading,
  OakSideMenuNav,
  OakTypography,
} from "@oaknational/oak-components";

import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import Layout from "@/components/AppComponents/Layout";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { TopNavProps } from "@/components/AppComponents/TopNav/TopNav";
import { AboutUsLayout } from "@/components/GenericPagesComponents/AboutUsLayout";
import { AboutSharedHeader } from "@/components/GenericPagesComponents/AboutSharedHeader";
import ProfileCard from "@/components/GenericPagesComponents/ProfileCard";
import { InnerMaxWidth } from "@/components/GenericPagesComponents/InnerMaxWidth";
import { getPosthogIdFromCookie } from "@/node-lib/posthog/getPosthogId";
import { getFeatureFlag } from "@/node-lib/posthog/getFeatureFlag";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import { MeetTheTeamContainer } from "@/components/GenericPagesComponents/MeetTheTeamContainer";
import CMSClient from "@/node-lib/cms";
import { MeetTheTeamPage } from "@/common-lib/cms-types/aboutPages";
import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";
import Card from "@/components/SharedComponents/Card";
import IconButtonAsLink from "@/components/SharedComponents/Button/IconButtonAsLink";
import BoxBorders from "@/components/SharedComponents/SpriteSheet/BrushSvgs/BoxBorders";
import getProxiedSanityAssetUrl from "@/common-lib/urls/getProxiedSanityAssetUrl";

const posthogApiKey = getBrowserConfig("posthogApiKey");

/**
 * Converts file size from bytes to megabytes and formats to 1 decimal place.
 * Returns just the number (e.g., "1.5") for custom formatting in the UI.
 * Note: We don't use convertBytesToMegabytes from lesson.helpers.ts because
 * it returns a different format with unit included (e.g., "1.5 MB").
 */
function formatFileSizeInMB(bytes: number): string {
  return (bytes / 1024 / 1024).toFixed(1);
}

const SECTION_TITLES = {
  leadership: "Our leadership",
  board: "Our board",
  documents: "Documents",
  governance: "Governance",
};

export type AboutUsMeetTheTeamPageProps = {
  pageData: MeetTheTeamPage;
  topNav: TopNavProps;
};

const AboutUsMeetTheTeam: NextPage<AboutUsMeetTheTeamPageProps> = ({
  pageData,
  topNav,
}) => {
  const {
    introText,
    leadershipText,
    boardText,
    leadershipTeam,
    boardMembers,
    documents,
    governancePortableText,
    seo,
  } = pageData;

  return (
    <Layout
      seoProps={getSeoProps(seo)}
      $background={"bg-primary"}
      topNavProps={topNav}
    >
      <AboutUsLayout>
        <AboutSharedHeader
          title={"Meet the team"}
          content={introText}
          titleHighlight="bg-decorative5-main"
        />
        <InnerMaxWidth>
          <OakFlex $gap={"spacing-16"}>
            <OakFlex
              $display={["none", "block", "block"]}
              style={{ minWidth: 200 }}
            >
              <OakSideMenuNav
                heading="Page sections"
                anchorTargetId=""
                menuItems={[
                  {
                    heading: "Our leadership",
                    href: "#our-leadership",
                  },
                  {
                    heading: "Our board",
                    href: "#our-board",
                  },
                  {
                    heading: "Documents",
                    href: "#documents",
                  },
                ]}
              />
            </OakFlex>
            <OakFlex
              $flexGrow={1}
              $flexDirection={"column"}
              $gap={["spacing-32", "spacing-56", "spacing-56"]}
              $pb={"spacing-80"}
            >
              <MeetTheTeamContainer
                title={SECTION_TITLES.leadership}
                text={leadershipText}
                anchor="our-leadership"
              >
                {leadershipTeam.map((member) => {
                  const slug = member.slug?.current ?? member.id;
                  const imageUrl = getProxiedSanityAssetUrl(
                    member.image?.asset?.url,
                  );
                  return (
                    <ProfileCard
                      key={member.id}
                      name={member.name}
                      role={member.role ?? ""}
                      image={imageUrl}
                      href={`/about-us/meet-the-team/${slug}`}
                    />
                  );
                })}
              </MeetTheTeamContainer>

              <MeetTheTeamContainer
                title={SECTION_TITLES.board}
                text={boardText}
                anchor="our-board"
              >
                {boardMembers.map((member) => {
                  const slug = member.slug?.current ?? member.id;
                  const imageUrl = getProxiedSanityAssetUrl(
                    member.image?.asset?.url,
                  );
                  return (
                    <ProfileCard
                      key={member.id}
                      name={member.name}
                      role={member.role ?? ""}
                      image={imageUrl}
                      href={`/about-us/meet-the-team/${slug}`}
                    />
                  );
                })}
              </MeetTheTeamContainer>

              {documents && documents.length > 0 && (
                <MeetTheTeamContainer
                  title={SECTION_TITLES.documents}
                  text={null}
                  anchor="documents"
                >
                  {documents.map((doc) => {
                    const fileSizeInMB = formatFileSizeInMB(
                      doc.file.asset.size,
                    );
                    return (
                      <Card key={doc.title} $width={240} $pa={16}>
                        <BoxBorders gapPosition="rightTop" />
                        <OakFlex
                          $justifyContent={"space-between"}
                          $flexDirection={"column"}
                          $height={"100%"}
                          $gap={"spacing-8"}
                        >
                          <OakTypography $font={"heading-7"}>
                            {doc.title}
                          </OakTypography>
                          <OakFlex
                            $alignItems={"center"}
                            $justifyContent={"space-between"}
                          >
                            <OakTypography
                              $font={"body-3"}
                            >{`${fileSizeInMB}MB ${doc.file.asset.extension.toUpperCase()}`}</OakTypography>
                            <IconButtonAsLink
                              icon={"download"}
                              aria-label={`Download ${doc.title} as ${fileSizeInMB} megabyte ${doc.file.asset.extension}`}
                              page={null}
                              href={`${doc.file.asset.url}?dl`}
                              background={"blue"}
                            />
                          </OakFlex>
                        </OakFlex>
                      </Card>
                    );
                  })}
                </MeetTheTeamContainer>
              )}

              <OakFlex $flexDirection={"column"} $gap={"spacing-16"}>
                <OakHeading tag="h3" $font={"heading-5"}>
                  {SECTION_TITLES.governance}
                </OakHeading>
                <OakTypography $font={["body-1", "body-2"]}>
                  <PortableTextWithDefaults
                    value={governancePortableText}
                    withoutDefaultComponents
                  />
                </OakTypography>
              </OakFlex>
            </OakFlex>
          </OakFlex>
        </InnerMaxWidth>
      </AboutUsLayout>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<
  AboutUsMeetTheTeamPageProps
> = async (context) => {
  const posthogUserId = getPosthogIdFromCookie(
    context.req.cookies,
    posthogApiKey,
  );
  let enableV2: boolean = false;
  if (posthogUserId) {
    // get the variant key for the user
    enableV2 =
      (await getFeatureFlag({
        featureFlagKey: "about-us--who-we-are--v2",
        posthogUserId,
      })) === true;
  }

  if (!enableV2) {
    return {
      notFound: true,
    };
  }

  const isPreviewMode = context.preview === true;
  const meetTheTeamPage = await CMSClient.meetTheTeamPage({
    previewMode: isPreviewMode,
  });

  const topNav = await curriculumApi2023.topNav();

  if (!meetTheTeamPage) {
    return {
      notFound: true,
    };
  }

  const results: GetStaticPropsResult<AboutUsMeetTheTeamPageProps> = {
    props: {
      pageData: meetTheTeamPage,
      topNav,
    },
  };
  return results;
};

export default AboutUsMeetTheTeam;
