import { NextPage, GetStaticPropsResult, GetServerSideProps } from "next";
import {
  OakBox,
  OakCard,
  OakFlex,
  OakHeading,
  OakSideMenuNav,
  OakTypography,
} from "@oaknational/oak-components";
import styled from "styled-components";

import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import Layout from "@/components/AppComponents/Layout";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { TopNavProps } from "@/components/AppComponents/TopNav/TopNav";
import { AboutUsLayout } from "@/components/GenericPagesComponents/AboutUsLayout";
import {
  AboutSharedHeader,
  AboutSharedHeaderImage,
} from "@/components/GenericPagesComponents/AboutSharedHeader";
import { InnerMaxWidth } from "@/components/GenericPagesComponents/InnerMaxWidth";
import { getPosthogIdFromCookie } from "@/node-lib/posthog/getPosthogId";
import { getFeatureFlag } from "@/node-lib/posthog/getFeatureFlag";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import { MeetTheTeamContainer } from "@/components/GenericPagesComponents/MeetTheTeamContainer";
import CMSClient from "@/node-lib/cms";
import { MeetTheTeamPage } from "@/common-lib/cms-types/aboutPages";
import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";
import getProxiedSanityAssetUrl from "@/common-lib/urls/getProxiedSanityAssetUrl";
import { convertBytesToMegabytes } from "@/components/TeacherComponents/helpers/lessonHelpers/lesson.helpers";

const posthogApiKey = getBrowserConfig("posthogApiKey");

const SECTION_TITLES = {
  leadership: "Our leadership",
  board: "Our board",
  documents: "Documents",
  governance: "Governance",
};

const SideMenuWrapper = styled.div`
  a {
    height: 40px;
    justify-content: center;
    text-decoration: none;
    padding-left: 16px;
  }

  a:hover {
    border-color: #222;
    text-decoration: none;
  }
`;

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
        >
          <AboutSharedHeaderImage
            imageAlt=""
            imageUrl="https://res.cloudinary.com/oak-web-application/image/upload/v1763393167/icons/snackbreak_illustration_fguw7l.svg"
          />
        </AboutSharedHeader>
        <InnerMaxWidth>
          <OakFlex $gap={["spacing-0", "spacing-16", "spacing-16"]}>
            <OakBox $pb={"spacing-80"}>
              <OakBox
                $minWidth={"spacing-180"}
                $display={["none", "block", "block"]}
                $position={"sticky"}
                $top="spacing-20"
                $pb={"spacing-80"}
              >
                <SideMenuWrapper>
                <OakSideMenuNav
                    heading=""
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
              </SideMenuWrapper>
              </OakBox>
            </OakBox>
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
                  const imageUrl =
                    getProxiedSanityAssetUrl(member.image?.asset?.url) ??
                    undefined;
                  return (
                    <ul
                      key={member.id}
                      style={{
                        padding: 0,
                        margin: 0,
                      }}
                    >
                      <OakCard
                        heading={member.name}
                        href={`/about-us/meet-the-team/${slug}?section=leadership`}
                        cardWidth={"100%"}
                        imageSrc={imageUrl}
                        subCopy={member.role ?? ""}
                        linkText="See bio"
                        linkIconName="chevron-right"
                      />
                    </ul>
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
                  const imageUrl =
                    getProxiedSanityAssetUrl(member.image?.asset?.url) ??
                    undefined;
                  return (
                    <ul
                      key={member.id}
                      style={{
                        padding: 0,
                        margin: 0,
                      }}
                    >
                      <OakCard
                        key={member.id}
                        heading={member.name}
                        href={`/about-us/meet-the-team/${slug}?section=board`}
                        cardWidth={"100%"}
                        imageSrc={imageUrl}
                        subCopy={member.role ?? ""}
                        linkText="See bio"
                        linkIconName="chevron-right"
                      />
                    </ul>
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
                    const fileSize = convertBytesToMegabytes(
                      doc.file.asset.size,
                    );
                    return (
                      <ul
                        key={doc.title}
                        style={{
                          padding: 0,
                          margin: 0,
                        }}
                      >
                        <OakCard
                          key={doc.title}
                          heading={doc.title}
                          href={`${doc.file.asset.url}?dl`}
                          cardWidth={"100%"}
                          subCopy={`${doc.file.asset.extension.toUpperCase()}, ${fileSize}`}
                          linkText="Download"
                          linkIconName="download"
                        />
                      </ul>
                    );
                  })}
                </MeetTheTeamContainer>
              )}

              <OakFlex $flexDirection={"column"} $gap={"spacing-16"}>
                <OakHeading
                  tag="h2"
                  $font={["heading-5", "heading-3", "heading-3"]}
                >
                  {SECTION_TITLES.governance}
                </OakHeading>
                <OakTypography $font={["body-2", "body-1", "body-1"]}>
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
