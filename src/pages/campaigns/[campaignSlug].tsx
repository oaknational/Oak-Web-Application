import { GetServerSideProps, GetServerSidePropsResult, NextPage } from "next";
import { OakFlex, OakHeading, OakP } from "@oaknational/oak-components";
import { PortableTextComponents } from "@portabletext/react";

import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import { CampaignPage } from "@/common-lib/cms-types/campaignPage";
import CMSClient from "@/node-lib/cms";
import AppLayout from "@/components/SharedComponents/AppLayout";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import { getFeatureFlag } from "@/node-lib/posthog/getFeatureFlag";
import { getPosthogIdFromCookie } from "@/node-lib/posthog/getPosthogId";
import getPageProps from "@/node-lib/getPageProps";
import curriculumApi2023, {
  KeyStagesData,
} from "@/node-lib/curriculum-api-2023";
import { CampaignPageHeader } from "@/components/GenericPagesComponents/CampaignPageHeader/CampaignPageHeader";
import { CampaignPageIntro } from "@/components/GenericPagesComponents/CampaignPageIntro/CampaignPageIntro";
import { CampaignPromoBanner } from "@/components/GenericPagesComponents/CampaignPromoBanner/CampaignPromoBanner";

export type CampaignSinglePageProps = {
  campaign: CampaignPage;
  keyStages: KeyStagesData;
};
export const campaignTextStyles: PortableTextComponents = {
  block: {
    heading1: (props) => {
      return (
        <OakHeading $font={["heading-5", "heading-5", "heading-2"]} tag="h2">
          {props.children}
        </OakHeading>
      );
    },
    heading2: (props) => {
      return (
        <OakHeading $font={["heading-5", "heading-4", "heading-3"]} tag="h2">
          {props.children}
        </OakHeading>
      );
    },
    heading3: (props) => {
      return (
        <OakHeading
          $font={["heading-light-7", "heading-light-6", "heading-light-5"]}
          tag="h3"
        >
          {props.children}
        </OakHeading>
      );
    },
    heading5: (props) => {
      return (
        <OakHeading
          $font={["heading-6", "heading-6", "heading-5"]}
          tag="h3"
          $mb={"space-between-m"}
        >
          {props.children}
        </OakHeading>
      );
    },
    normal: (props) => {
      return <OakP $font={["body-1", "body-1"]}>{props.children}</OakP>;
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
      <OakFlex
        $alignItems="center"
        $flexDirection="column"
        $width="100%"
        $pv={"inner-padding-xl2"}
        $ph={["inner-padding-l", "inner-padding-l", "inner-padding-xl5"]}
      >
        <CampaignPageHeader
          campaignHeader={props.campaign.header}
          keyStages={props.keyStages}
        />
        {props.campaign.content.map((section) => {
          if (section.type === "CampaignIntro") {
            return (
              <CampaignPageIntro
                textStyles={campaignTextStyles}
                heading={section.headingPortableTextWithPromo}
                body={section.bodyPortableTextWithPromo}
                key={section.type}
              />
            );
          }
          if (section.type === "CampaignPromoBanner") {
            const media = section.media[0];
            if (media)
              return (
                <CampaignPromoBanner
                  textStyles={campaignTextStyles}
                  heading={section.headingPortableTextWithPromo}
                  body={section.bodyPortableTextWithPromo}
                  media={media}
                  key={section.type}
                />
              );
          }
        })}
      </OakFlex>
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

      const keyStages = await curriculumApi2023.keyStages();

      if (!campaignPageResult || !keyStages) {
        return {
          notFound: true,
        };
      }

      const results: GetServerSidePropsResult<CampaignSinglePageProps> = {
        props: {
          campaign: campaignPageResult,
          keyStages,
        },
      };
      return results;
    },
  });
};

export default CampaignSinglePage;
