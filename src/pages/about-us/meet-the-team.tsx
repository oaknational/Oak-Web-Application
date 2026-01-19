import { NextPage, GetStaticPropsResult, GetServerSideProps } from "next";
import { OakBox, OakFlex, OakHeading, OakP } from "@oaknational/oak-components";

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
import { testAboutWhoWeArePageData } from "@/__tests__/pages/about-us/meet-the-team.test";

const posthogApiKey = getBrowserConfig("posthogApiKey");

type Download = {
  title: string;
  subText: string;
  href: string;
};

type Person = {
  slug: string;
  name: string;
  position: string;
  image?: string;
};

export type AboutUsMeetTheTeamPage = {
  pageData: {
    subTitle: string;
    leadershipTitle: string;
    leadershipText: string;
    leadershipList: Person[];
    boardTitle: string;
    boardText: string;
    boardList: Person[];
    documentTitle: string;
    documentText: string | null;
    documentList: Download[];
    governanceTitle: string;
    governanceText: string;
  };
  topNav: TopNavProps;
};

const AboutUsMeetTheTeam: NextPage<AboutUsMeetTheTeamPage> = ({
  pageData,
  topNav,
}) => {
  return (
    <Layout
      seoProps={getSeoProps(null)}
      $background={"bg-primary"}
      topNavProps={topNav}
    >
      <AboutUsLayout>
        <AboutSharedHeader
          title={"Meet the team"}
          content={pageData.subTitle}
          titleHighlight="bg-decorative5-main"
        />
        <InnerMaxWidth>
          <OakFlex $gap={"spacing-16"}>
            <OakFlex
              $display={["none", "block", "block"]}
              style={{ minWidth: 200 }}
            >
              TODO: SideNav
            </OakFlex>
            <OakFlex
              $flexGrow={1}
              $flexDirection={"column"}
              $gap={["spacing-32", "spacing-56", "spacing-56"]}
              $pb={"spacing-80"}
            >
              <MeetTheTeamContainer
                title={pageData.leadershipTitle}
                text={pageData.leadershipText}
              >
                {pageData.leadershipList.map(
                  (leadershipItem, leadershipItemIndex) => {
                    return (
                      // TODO: Replace me!
                      <ProfileCard
                        key={leadershipItemIndex}
                        name={leadershipItem.name}
                        role={leadershipItem.position}
                        href={`/about-us/meet-the-team/${leadershipItem.slug}`}
                      />
                    );
                  },
                )}
              </MeetTheTeamContainer>

              <MeetTheTeamContainer
                title={pageData.boardTitle}
                text={pageData.boardText}
              >
                {pageData.boardList.map((boardItem, boardItemIndex) => {
                  return (
                    // TODO: Replace me!
                    <ProfileCard
                      key={boardItemIndex}
                      name={boardItem.name}
                      role={boardItem.position}
                      href={`/about-us/meet-the-team/${boardItem.slug}`}
                    />
                  );
                })}
              </MeetTheTeamContainer>

              <MeetTheTeamContainer
                title={pageData.documentTitle}
                text={pageData.documentText}
              >
                {pageData.documentList.map(
                  (documentItem, documentItemIndex) => {
                    return (
                      // TODO: Replace me!
                      <OakBox
                        key={documentItemIndex}
                        $width={"spacing-240"}
                        $pa={"spacing-16"}
                        $borderRadius={"border-radius-m2"}
                        $background={"bg-btn-secondary"}
                      >
                        <OakBox>{documentItem.title}</OakBox>
                        <OakBox>{documentItem.subText}</OakBox>
                      </OakBox>
                    );
                  },
                )}
              </MeetTheTeamContainer>

              <OakFlex $flexDirection={"column"} $gap={"spacing-16"}>
                <OakHeading tag="h3">{pageData.governanceTitle}</OakHeading>
                <OakP>{pageData.governanceText}</OakP>
              </OakFlex>
            </OakFlex>
          </OakFlex>
        </InnerMaxWidth>
      </AboutUsLayout>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<
  AboutUsMeetTheTeamPage
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

  // TODO: Replace the mock data with something like the following
  // const isPreviewMode = context.preview === true;
  // const aboutWhoWeArePage = await CMSClient.newAboutGetInvolvedPage({
  //   previewMode: isPreviewMode,
  // });

  // TODO: Remove mock data `testAboutWhoWeArePageData`
  const aboutMeetTheTeamPage = testAboutWhoWeArePageData;

  const topNav = await curriculumApi2023.topNav();

  if (!aboutMeetTheTeamPage) {
    return {
      notFound: true,
    };
  }

  const results: GetStaticPropsResult<AboutUsMeetTheTeamPage> = {
    props: {
      pageData: aboutMeetTheTeamPage,
      topNav,
    },
  };
  return results;
};

export default AboutUsMeetTheTeam;
