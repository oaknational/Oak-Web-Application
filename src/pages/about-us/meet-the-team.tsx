import { NextPage, GetStaticPropsResult, GetServerSideProps } from "next";
import {
  OakCard,
  OakFlex,
  OakHeading,
  OakP,
  OakSideMenuNav,
} from "@oaknational/oak-components";

import placeholderImage from "../../../public/images/oak-national-academy-logo-512.png";

import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import Layout from "@/components/AppComponents/Layout";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { TopNavProps } from "@/components/AppComponents/TopNav/TopNav";
import { AboutUsLayout } from "@/components/GenericPagesComponents/AboutUsLayout";
import { AboutSharedHeader } from "@/components/GenericPagesComponents/AboutSharedHeader";
import { InnerMaxWidth } from "@/components/GenericPagesComponents/InnerMaxWidth";
import { getPosthogIdFromCookie } from "@/node-lib/posthog/getPosthogId";
import { getFeatureFlag } from "@/node-lib/posthog/getFeatureFlag";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import { MeetTheTeamContainer } from "@/components/GenericPagesComponents/MeetTheTeamContainer";

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

export const mockData: AboutUsMeetTheTeamPage["pageData"] = {
  // title: "Meet the team",
  subTitle:
    "Learn more about the experts from across education, technology, school support and education who make up our leadership team and board.",
  leadershipTitle: "Our leadership",
  leadershipText:
    "Our leadership team brings together experts to deliver the best support to teachers and value for money for the public. Learn more about them below.",
  leadershipList: new Array(12).fill(true).map((_, index) => ({
    slug: `ed-southall-${index}`,
    name: "Ed Southall",
    position: "Subject Lead (maths)",
  })),
  boardTitle: "Our board",
  boardText:
    "Our Board oversees all of our work at Oak National Academy. They provide strategic direction, enable us to deliver on our plans, scrutinise our work and safeguard our independence.",
  boardList: new Array(12).fill(true).map((_, index) => ({
    slug: `ed-southall-${index}`,
    name: "Ed Southall",
    position: "Subject Lead (maths)",
  })),
  documentTitle: "Documents",
  documentText: null,
  documentList: new Array(12).fill(true).map((_, index) => ({
    title: "Impact evaluation of Oak: 2023/24",
    subText: "PDF, 1.6MB",
    href: `#${index}`,
  })),
  governanceTitle: "Governance",
  governanceText:
    "Oak National Academy is a limited company incorporated under the Companies Act 2006 in September 2022 and whose sole shareholder is the Secretary of State for Education. It is a non-departmental public body (NDPB) which was established to work with schools, teachers and the wider education system and has a framework agreement with the Department for Education.",
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
                title={pageData.leadershipTitle}
                text={pageData.leadershipText}
                anchor="our-leadership"
              >
                {pageData.leadershipList.map((leadershipItem) => {
                  return (
                    <OakCard
                      key={leadershipItem.slug}
                      heading={leadershipItem.name}
                      href={`/about-us/meet-the-team/${leadershipItem.slug}`}
                      cardWidth={"100%"}
                      imageSrc={placeholderImage.src}
                      imageAlt={`Picture of ${leadershipItem.name}`}
                      subCopy={leadershipItem.position}
                      linkText="See bio"
                      linkIconName="chevron-right"
                    />
                  );
                })}
              </MeetTheTeamContainer>

              <MeetTheTeamContainer
                title={pageData.boardTitle}
                text={pageData.boardText}
                anchor="our-board"
              >
                {pageData.boardList.map((boardItem) => {
                  return (
                    <OakCard
                      key={boardItem.slug}
                      heading={boardItem.name}
                      href={`/about-us/meet-the-team/${boardItem.slug}`}
                      cardWidth={"100%"}
                      imageSrc={placeholderImage.src}
                      imageAlt={`Picture of ${boardItem.name}`}
                      subCopy={boardItem.position}
                      linkText="See bio"
                      linkIconName="chevron-right"
                    />
                  );
                })}
              </MeetTheTeamContainer>

              <MeetTheTeamContainer
                title={pageData.documentTitle}
                text={pageData.documentText}
                anchor="documents"
              >
                {pageData.documentList.map((documentItem) => {
                  return (
                    <OakCard
                      key={documentItem.href}
                      heading={documentItem.title}
                      href={documentItem.href}
                      cardWidth={"100%"}
                      subCopy={documentItem.subText}
                      linkText="Download"
                      linkIconName="download"
                    />
                  );
                })}
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

  // Replace me with non-mocked data
  const aboutMeetTheTeamPage = mockData;

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
