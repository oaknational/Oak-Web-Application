import { NextPage, GetStaticProps, GetStaticPropsResult } from "next";

import CMSClient from "../../node-lib/cms";
import { decorateWithIsr } from "../../node-lib/isr";
import Layout from "../../components/Layout";
import MaxWidth from "../../components/MaxWidth/MaxWidth";
import AboutContactCard from "../../components/AboutContactCard";
import { Heading } from "../../components/Typography";
import AboutUsSummaryCard from "../../components/pages/AboutUs/AboutUsSummaryCard";
import BioCardList from "../../components/BioCardList";
import AboutIntroCard from "../../components/AboutIntoCard/AboutIntroCard";
import { getSeoProps } from "../../browser-lib/seo/getSeoProps";
import { AboutLeadershipPage } from "../../common-lib/cms-types";

export type AboutPageProps = {
  pageData: AboutLeadershipPage;
};

const AboutUsLeadership: NextPage<AboutPageProps> = ({ pageData }) => {
  const { seo, introPortableText, leadershipTeam } = pageData;

  return (
    <Layout seoProps={getSeoProps(seo)} $background={"white"}>
      <MaxWidth $pt={[64, 80]}>
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
              $mb={[80, 92]}
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
  context
) => {
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
  const resultsWithIsr = decorateWithIsr(results);
  return resultsWithIsr;
};

export default AboutUsLeadership;
