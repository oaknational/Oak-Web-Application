import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";
import { OakHeading } from "@oaknational/oak-components";
import { PortableTextComponents } from "@portabletext/react";

import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import { CampaignPage } from "@/common-lib/cms-types/campaignPage";
import CMSClient from "@/node-lib/cms";
import getPageProps from "@/node-lib/getPageProps";
import {
  shouldSkipInitialBuild,
  getFallbackBlockingConfig,
} from "@/node-lib/isr";
import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";
import AppLayout from "@/components/SharedComponents/AppLayout";

export type CampaignSinglePageProps = {
  campaign: CampaignPage;
};

const h2: PortableTextComponents = {
  block: {
    normal: (props) => {
      return (
        <OakHeading $font="heading-2" tag="h2">
          {props.children}
        </OakHeading>
      );
    },
  },
};

const CampaignSinglePage: NextPage<CampaignSinglePageProps> = (props) => {
  console.log("CampaignSinglePage props:", props);

  return (
    <AppLayout
      seoProps={getSeoProps({
        title: props.campaign.seo?.title || props.campaign.title,
      })}
    >
      {props.campaign.content.map((content) => {
        if (content.type === "CampaignIntro") {
          return (
            <PortableTextWithDefaults
              value={content.headingPortableTextWithPromo}
              components={h2}
            />
          );
        }
      })}
    </AppLayout>
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
