import { NextPage, GetStaticProps, GetStaticPropsResult } from "next";

import CMSClient from "@/node-lib/cms";
import AboutContactCard from "@/components/GenericPagesComponents/AboutContactCard";
import AboutUsSummaryCard from "@/components/pages/AboutUs/AboutUsSummaryCard";
import BioCardList from "@/components/GenericPagesComponents/BioCardList";
import AboutIntroCard from "@/components/ArchivedComponents/AboutIntoCard/AboutIntroCard";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import { AboutLeadershipPage } from "@/common-lib/cms-types";
import getPageProps from "@/node-lib/getPageProps";
import MaxWidth from "@/components/SharedComponents/MaxWidth";
import Layout from "@/components/SharedComponents/Layout";
import { Heading } from "@/components/SharedComponents/Typography";

export type AboutPageProps = {
  pageData: AboutLeadershipPage;
};

const AboutUsLeadership: NextPage<AboutPageProps> = ({ pageData }) => {
  const { seo, introPortableText, leadershipTeam } = pageData;

  return (
    <Layout seoProps={getSeoProps(seo)} $background={"white"}>
      <MaxWidth $mb={[56, 80]} $pt={[64, 80]}>
        <AboutUsSummaryCard {...pageData} />
        <AboutIntroCard
          image={{
            illustration: "supporting",
            sizes: "(min-width: 750px) 720px, 100vw",
            priority: true,
          }}
          bodyPortableText={introPortableText}
        />
        {leadershipTeam && (
          <>
            <Heading
              $mb={[40, 32]}
              $font={["heading-6", "heading-5"]}
              tag={"h2"}
              $textAlign={"center"}
            >
              Our leadership
            </Heading>
            <BioCardList
              $mb={[80, 60]}
              $ph={[16, 0]}
              bios={leadershipTeam}
              withModals
              firstBioHasOwnRow
            />
          </>
        )}

        <AboutContactCard {...pageData.contactSection} />
      </MaxWidth>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<AboutPageProps> = async (
  context,
) => {
  return getPageProps({
    page: "leadership::getStaticProps",
    context,
    getProps: async () => {
      const isPreviewMode = context.preview === true;

      const aboutLeadershipPage = await CMSClient.aboutLeadershipPage({
        previewMode: isPreviewMode,
      });

      if (!aboutLeadershipPage) {
        return {
          notFound: true,
        };
      }

      const results: GetStaticPropsResult<AboutPageProps> = {
        props: {
          pageData: aboutLeadershipPage,
        },
      };
      return results;
    },
  });
};

export default AboutUsLeadership;
