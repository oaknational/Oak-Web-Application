import { GetServerSideProps, GetServerSidePropsResult, NextPage } from "next";
import {
  OakBox,
  OakFlex,
  OakHeading,
  OakMaxWidth,
} from "@oaknational/oak-components";
import { PortableTextComponents } from "@portabletext/react";

import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import { CampaignPage } from "@/common-lib/cms-types/campaignPage";
import CMSClient from "@/node-lib/cms";
import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText";
import AppLayout from "@/components/SharedComponents/AppLayout";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import { getFeatureFlag } from "@/node-lib/posthog/getFeatureFlag";
import { getPosthogIdFromCookie } from "@/node-lib/posthog/getPosthogId";
import getPageProps from "@/node-lib/getPageProps";
import CMSImage from "@/components/SharedComponents/CMSImage";
import { Image } from "@/common-lib/cms-types";

export type CampaignSinglePageProps = {
  campaign: CampaignPage;
};

const h2: PortableTextComponents = {
  block: {
    normal: (props) => {
      return (
        <OakHeading $font={["heading-5", "heading-4", "heading-2"]} tag="h2">
          {props.children}
        </OakHeading>
      );
    },
  },
};

const CampaignSinglePage: NextPage<CampaignSinglePageProps> = (props) => {
  return (
    <AppLayout
      seoProps={{
        ...getSeoProps({
          ...props.campaign.seo,
          title: props.campaign.seo?.title || props.campaign.title,
          description: props.campaign.seo?.description,
        }),
        noIndex: true,
        noFollow: true,
      }}
    >
      <OakMaxWidth>
        {props.campaign.content.map((content) => {
          if (content.type === "CampaignIntro") {
            return (
              <PortableTextWithDefaults
                value={content.headingPortableTextWithPromo}
                components={h2}
              />
            );
          }
          if (content.type === "CampaignPromoBanner") {
            // we get an array here but seem to expect an object
            const media: Image = content.media[0] as Image;
            return (
              <OakFlex
                $flexDirection={["column", "row"]}
                $width={"100%"}
                $gap={"space-between-m2"}
                $borderRadius={"border-radius-xl"}
                $pv={["inner-padding-xl5"]}
                $ph={["inner-padding-xl"]}
              >
                <OakFlex
                  $flexDirection={"column"}
                  $gap={["space-between-m", "space-between-l"]}
                >
                  <PortableTextWithDefaults
                    value={content.headingPortableTextWithPromo}
                    components={h2}
                  />

                  <PortableTextWithDefaults
                    value={content.bodyPortableTextWithPromo}
                  />
                </OakFlex>

                <OakBox>
                  <CMSImage image={media} />
                </OakBox>
              </OakFlex>
            );
          }
        })}
      </OakMaxWidth>
    </AppLayout>
  );
};

type URLParams = { campaignSlug: string };

// TODO: Uncomment when ready for static generation
// export const getStaticPaths = async () => {
//   if (shouldSkipInitialBuild) {
//     return getFallbackBlockingConfig();
//   }

//   const campaignPages = await CMSClient.campaigns();

//   const paths = campaignPages.map((campaign) => ({
//     params: { campaignSlug: campaign.slug },
//   }));

//   const config: GetStaticPathsResult<URLParams> = {
//     fallback: "blocking",
//     paths,
//   };
//   return config;
// };

const posthogApiKey = getBrowserConfig("posthogApiKey");

export const getServerSideProps: GetServerSideProps<
  CampaignSinglePageProps,
  URLParams
> = async (context) => {
  return getPageProps({
    page: "campaign-single::getServerSideProps",
    context,
    withIsr: false,
    getProps: async () => {
      const posthogUserId = getPosthogIdFromCookie(
        context.req.cookies,
        posthogApiKey,
      );

      let variantKey: string | boolean | undefined;

      if (posthogUserId) {
        variantKey = await getFeatureFlag({
          featureFlagKey: "mythbusting-campaign",
          posthogUserId,
        });
      }

      if (variantKey !== true) {
        return {
          notFound: true,
        };
      }

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

      const results: GetServerSidePropsResult<CampaignSinglePageProps> = {
        props: {
          campaign: campaignPageResult,
        },
      };
      return results;
    },
  });
};

export default CampaignSinglePage;
