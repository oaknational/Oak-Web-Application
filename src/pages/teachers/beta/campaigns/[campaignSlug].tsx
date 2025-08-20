import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";

import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import { CampaignPage } from "@/common-lib/cms-types/campaignPage";
import Layout from "@/components/AppComponents/Layout";
import CMSClient from "@/node-lib/cms";
import getPageProps from "@/node-lib/getPageProps";
import {
  shouldSkipInitialBuild,
  getFallbackBlockingConfig,
} from "@/node-lib/isr";

export type CampaignSinglePageProps = {
  campaign: CampaignPage;
};

const CampaignSinglePage: NextPage<CampaignSinglePageProps> = (props) => {
  console.log("CampaignSinglePage props:", props);

  return (
    <Layout
      seoProps={getSeoProps({
        title: props.campaign.seo?.title || props.campaign.title,
      })}
     />
  );
};

type URLParams = { campaignSlug: string };

export const getStaticPaths = async () => {
  if (shouldSkipInitialBuild) {
    return getFallbackBlockingConfig();
  }

  const campaignPages = await CMSClient.campaigns();

  const paths = campaignPages.map((campaign) => ({
    params: { campaignSlug: campaign.slug },
  }));

  const config: GetStaticPathsResult<URLParams> = {
    fallback: "blocking",
    paths,
  };
  return config;
};

export const getStaticProps: GetStaticProps<
  CampaignSinglePageProps,
  URLParams
> = async (context) => {
  return getPageProps({
    page: "campaign-single::getStaticProps",
    context,
    getProps: async () => {
      const campaignSlug = context.params?.campaignSlug as string;
      const isPreviewMode = context.preview === true;

      const campaignPageResult = await CMSClient.campaignPageBySlug(
        campaignSlug,
        {
          previewMode: isPreviewMode,
        },
      );

      if (!campaignPageResult) {
        return {
          notFound: true,
        };
      }

      const results: GetStaticPropsResult<CampaignSinglePageProps> = {
        props: {
          campaign: campaignPageResult,
        },
      };
      return results;
    },
  });
};

export default CampaignSinglePage;
