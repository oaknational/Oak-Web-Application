import { NextPage, GetStaticProps, GetStaticPropsResult } from "next";

import CMSClient from "@/node-lib/cms";
import getPageProps from "@/node-lib/getPageProps";
import { WhoWeArePage } from "@/common-lib/cms-types/aboutPages";
import {
  AboutSharedHeader,
  AboutSharedHeaderImage,
} from "@/components/GenericPagesComponents/AboutSharedHeader";
import { WhoAreWeBreakout } from "@/components/GenericPagesComponents/WhoAreWeBreakout";
import WhoAreWeTimeline from "@/components/GenericPagesComponents/WhoAreWeTimeline";
import { WhoAreWeDesc } from "@/components/GenericPagesComponents/WhoAreWeDesc";
import { AboutUsLayout } from "@/components/GenericPagesComponents/AboutUsLayout";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import Layout from "@/components/AppComponents/Layout";
import { TopNavProps } from "@/components/AppComponents/TopNav/TopNav";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";

export type WhoWeArePageProps = {
  pageData: WhoWeArePage;
  topNav: TopNavProps;
};

const WhoWeAre: NextPage<WhoWeArePageProps> = ({ pageData, topNav }) => {
  return (
    <Layout
      seoProps={getSeoProps({ title: "Who We Are" })}
      $background={"bg-primary"}
      topNavProps={topNav}
    >
      <AboutUsLayout>
        <AboutSharedHeader
          title={"About Oak"}
          content={pageData.header2.introText}
        >
          <AboutSharedHeaderImage
            imageAlt={pageData.header2.image?.altText ?? ""}
            imageUrl={pageData.header2.image?.asset?.url ?? ""}
          />
        </AboutSharedHeader>
        <WhoAreWeBreakout
          image={pageData.breakout2.image}
          content={pageData.breakout2.text}
        />
        <WhoAreWeTimeline
          title={"As teaching evolves, so do we..."}
          subTitle={"Oak’s story"}
          items={pageData.timeline2.timelineItems}
        />
        <WhoAreWeDesc title={"We are..."} items={pageData.weAreCards.cards} />
      </AboutUsLayout>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<WhoWeArePageProps> = async (
  context,
) => {
  return getPageProps({
    page: "about-who-we-are::getStaticProps",
    context,
    getProps: async () => {
      const isPreviewMode = context.preview === true;

      const pageData = await CMSClient.newAboutWhoWeArePage({
        previewMode: isPreviewMode,
      });

      if (!pageData) {
        return {
          notFound: true,
        };
      }

      const topNav = await curriculumApi2023.topNav();

      const results: GetStaticPropsResult<WhoWeArePageProps> = {
        props: {
          pageData,
          topNav,
        },
      };
      return results;
    },
  });
};

export default WhoWeAre;
