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

const posthogApiKey = getBrowserConfig("posthogApiKey");

export type AboutPageProps = {
  pageData: typeof mockData;
  topNav: TopNavProps;
};

const AboutUsLeadership: NextPage<AboutPageProps> = ({ pageData, topNav }) => {
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
        {/*  */}
        <InnerMaxWidth>
          <OakFlex $gap={"spacing-16"}>
            <OakFlex style={{ minWidth: 200 }}>TODO: SideNav</OakFlex>
            <OakFlex
              $flexGrow={1}
              $flexDirection={"column"}
              $gap={"spacing-56"}
              $pb={"spacing-80"}
            >
              <OakBox
                $background={"bg-decorative5-very-subdued"}
                $pa={"spacing-24"}
              >
                <OakFlex $gap={"spacing-16"} $flexDirection={"column"}>
                  <OakHeading tag="h2">{pageData.leadershipTitle}</OakHeading>
                  <OakP>{pageData.leadershipText}</OakP>
                  <OakFlex $gap={"spacing-16"} $flexWrap={"wrap"}>
                    {pageData.leadershipList.map((leadershipItem) => {
                      return (
                        // TODO: Replace me!
                        <ProfileCard
                          name={leadershipItem.name}
                          role={leadershipItem.position}
                          href={`/about-us/meet-the-team/${leadershipItem.slug}`}
                        />
                      );
                    })}
                  </OakFlex>
                </OakFlex>
              </OakBox>

              <OakBox
                $background={"bg-decorative5-very-subdued"}
                $pa={"spacing-24"}
              >
                <OakFlex $gap={"spacing-16"} $flexDirection={"column"}>
                  <OakHeading tag="h2">{pageData.boardTitle}</OakHeading>
                  <OakP>{pageData.boardText}</OakP>
                  <OakFlex $gap={"spacing-16"} $flexWrap={"wrap"}>
                    {pageData.boardList.map((boardItem) => {
                      return (
                        // TODO: Replace me!
                        <ProfileCard
                          name={boardItem.name}
                          role={boardItem.position}
                          href={`/about-us/meet-the-team/${boardItem.slug}`}
                        />
                      );
                    })}
                  </OakFlex>
                </OakFlex>
              </OakBox>

              <OakBox
                $background={"bg-decorative5-very-subdued"}
                $pa={"spacing-24"}
              >
                <OakFlex $gap={"spacing-16"} $flexDirection={"column"}>
                  <OakHeading tag="h2">{pageData.documentTitle}</OakHeading>
                  <OakP>{pageData.documentText}</OakP>
                  <OakFlex $gap={"spacing-16"} $flexWrap={"wrap"}>
                    {pageData.documentList.map((documentItem) => {
                      return (
                        // TODO: Replace me!
                        <OakBox
                          $width={"spacing-240"}
                          $pa={"spacing-16"}
                          $borderRadius={"border-radius-m2"}
                          $background={"bg-btn-secondary"}
                        >
                          <OakBox>{documentItem.title}</OakBox>
                          <OakBox>{documentItem.subText}</OakBox>
                        </OakBox>
                      );
                    })}
                  </OakFlex>
                </OakFlex>
              </OakBox>

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

const mockPerson = {
  slug: "ed-southall",
  name: "Ed Southall",
  position: "Subject Lead (maths)",
};

const mockDownload = {
  title: "Impact evaluation of Oak: 2023/24",
  subText: "PDF, 1.6MB",
  href: "#",
};

export type Person = {
  slug: string;
  name: string;
  position: string;
  image: string;
};

export const mockData = {
  // title: "Meet the team",
  subTitle:
    "Learn more about the experts from across education, technology, school support and education who make up our leadership team and board.",
  leadershipTitle: "Our leadership",
  leadershipText:
    "Our leadership team brings together experts to deliver the best support to teachers and value for money for the public. Learn more about them below.",
  leadershipList: Array(12)
    .fill(true)
    .map(() => mockPerson),
  boardTitle: "Our board",
  boardText:
    "Our Board oversees all of our work at Oak National Academy. They provide strategic direction, enable us to deliver on our plans, scrutinise our work and safeguard our independence.",
  boardList: [
    {
      slug: "ian-bauckham",
      name: "Sir Ian Bauckham CBE",
      position: "Chair",
      image: "#",
    },
    {
      slug: "hardip-begol",
      name: "Hardip Begol CBE",
      position: "Board member",
      image: "#",
    },
  ],
  documentTitle: "Documents",
  documentText: null,
  documentList: Array(12)
    .fill(true)
    .map(() => mockDownload),
  governanceTitle: "Governance",
  governanceText:
    "Oak National Academy is a limited company incorporated under the Companies Act 2006 in September 2022 and whose sole shareholder is the Secretary of State for Education. It is a non-departmental public body (NDPB) which was established to work with schools, teachers and the wider education system and has a framework agreement with the Department for Education.",
};

export const getServerSideProps: GetServerSideProps<AboutPageProps> = async (
  context,
) => {
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

  const aboutMeetTheTeamPage = mockData;

  const topNav = await curriculumApi2023.topNav();

  if (!aboutMeetTheTeamPage) {
    return {
      notFound: true,
    };
  }

  const results: GetStaticPropsResult<AboutPageProps> = {
    props: {
      pageData: aboutMeetTheTeamPage,
      topNav,
    },
  };
  return results;
};

export default AboutUsLeadership;
