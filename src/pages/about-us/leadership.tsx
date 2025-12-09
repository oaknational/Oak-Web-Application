import { NextPage, GetStaticProps, GetStaticPropsResult } from "next";
import { OakMaxWidth, OakHeading } from "@oaknational/oak-components";

import CMSClient from "@/node-lib/cms";
import GenericContactCard from "@/components/GenericPagesComponents/GenericContactCard";
import GenericSummaryCard from "@/components/GenericPagesComponents/GenericSummaryCard";
import BioCardList from "@/components/GenericPagesComponents/BioCardList";
import GenericIntroCard from "@/components/GenericPagesComponents/GenericIntroCard";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import { AboutLeadershipPage } from "@/common-lib/cms-types";
import getPageProps from "@/node-lib/getPageProps";
import Layout from "@/components/AppComponents/Layout";

export type AboutPageProps = {
  pageData: AboutLeadershipPage;
};

const AboutUsLeadership: NextPage<AboutPageProps> = ({ pageData }) => {
  const { seo, introPortableText, leadershipTeam } = pageData;

  return (
    <Layout seoProps={getSeoProps(seo)} $background={"bg-primary"}>
      <OakMaxWidth
        $mb={["spacing-56", "spacing-80"]}
        $mt={["spacing-56", "spacing-80"]}
      >
        <GenericSummaryCard {...pageData} />
        <GenericIntroCard
          image={{
            illustration: "supporting",
            sizes: "(min-width: 750px) 720px, 100vw",
            priority: true,
          }}
          bodyPortableText={introPortableText}
        />
        {leadershipTeam && (
          <>
            <OakHeading
              $mb={["spacing-48", "spacing-32"]}
              $font={["heading-6", "heading-5"]}
              tag={"h2"}
              $textAlign={"center"}
            >
              Our leadership
            </OakHeading>
            <BioCardList
              $mb={["spacing-80", "spacing-56"]}
              $ph={["spacing-16", "spacing-0"]}
              bios={leadershipTeam}
              withModals
              firstBioHasOwnRow
            />
          </>
        )}

        <GenericContactCard {...pageData.contactSection} />
      </OakMaxWidth>
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
