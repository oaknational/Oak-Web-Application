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

import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import { MeetTheTeamPage } from "@/common-lib/cms-types/aboutPages";
import getProxiedSanityAssetUrl from "@/common-lib/urls/getProxiedSanityAssetUrl";
import CMSClient from "@/node-lib/cms";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import Layout from "@/components/AppComponents/Layout";
import { TopNavProps } from "@/components/AppComponents/TopNav/TopNav";
import {
  AboutSharedHeader,
  AboutSharedHeaderImage,
} from "@/components/GenericPagesComponents/AboutSharedHeader";
import { AboutUsLayout } from "@/components/GenericPagesComponents/AboutUsLayout";
import { MeetTheTeamContainer } from "@/components/GenericPagesComponents/MeetTheTeamContainer";
import { NewGutterMaxWidth } from "@/components/GenericPagesComponents/NewGutterMaxWidth";
import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";
import { convertBytesToMegabytes } from "@/components/TeacherComponents/helpers/lessonHelpers/lesson.helpers";
import isNewAboutUsPagesEnabled from "@/utils/isNewAboutUsPagesEnabled";

const posthogApiKey = getBrowserConfig("posthogApiKey");

const SECTION_TITLES = {
  leadership: "Our leadership",
  board: "Our board",
  documents: "Documents",
  governance: "Governance",
};

const UnstyledLi = styled.li`
  list-style: none;
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
        <NewGutterMaxWidth>
          <OakFlex
            $gap={["spacing-0", "spacing-16", "spacing-16"]}
            $pb={"spacing-80"}
          >
            <OakBox $pb={"spacing-80"}>
              <OakBox
                $position={"sticky"}
                $top={"spacing-20"}
                $display={["none", "block", "block"]}
                $minWidth={"spacing-180"}
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
              </OakBox>
            </OakBox>
            <OakFlex
              $flexGrow={1}
              $flexDirection={"column"}
              $gap={["spacing-32", "spacing-56", "spacing-56"]}
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
                    <UnstyledLi key={member.id}>
                      <OakCard
                        heading={member.name}
                        href={`/about-us/meet-the-team/${slug}?section=leadership`}
                        cardWidth={"100%"}
                        imageSrc={imageUrl}
                        subCopy={member.role ?? ""}
                        linkText="See bio"
                        linkIconName="chevron-right"
                      />
                    </UnstyledLi>
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
                    <UnstyledLi key={member.id}>
                      <OakCard
                        heading={member.name}
                        href={`/about-us/meet-the-team/${slug}?section=board`}
                        cardWidth={"100%"}
                        imageSrc={imageUrl}
                        subCopy={member.role ?? ""}
                        linkText="See bio"
                        linkIconName="chevron-right"
                      />
                    </UnstyledLi>
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
                      <UnstyledLi key={doc.title}>
                        <OakCard
                          heading={doc.title}
                          href={`${doc.file.asset.url}?dl`}
                          cardWidth={"100%"}
                          subCopy={`${doc.file.asset.extension.toUpperCase()}, ${fileSize}`}
                          linkText="Download"
                          linkIconName="download"
                        />
                      </UnstyledLi>
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
        </NewGutterMaxWidth>
      </AboutUsLayout>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps<
  AboutUsMeetTheTeamPageProps
> = async (context) => {
  const enableV2 = await isNewAboutUsPagesEnabled(
    posthogApiKey,
    context.req.cookies,
  );

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
