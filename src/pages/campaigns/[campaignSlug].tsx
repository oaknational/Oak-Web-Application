import { GetServerSideProps, GetServerSidePropsResult, NextPage } from "next";
import { OakBox, OakFlex, OakHeading } from "@oaknational/oak-components";

import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import { CampaignPage } from "@/common-lib/cms-types/campaignPage";
import CMSClient from "@/node-lib/cms";
import AppLayout from "@/components/SharedComponents/AppLayout";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import { getFeatureFlag } from "@/node-lib/posthog/getFeatureFlag";
import { getPosthogIdFromCookie } from "@/node-lib/posthog/getPosthogId";
import getPageProps from "@/node-lib/getPageProps";
import CMSImage from "@/components/SharedComponents/CMSImage";
import KeyStageKeypad from "@/components/SharedComponents/KeyStageKeypad";
import curriculumApi2023, {
  KeyStagesData,
} from "@/node-lib/curriculum-api-2023";
import SearchForm from "@/components/SharedComponents/SearchForm";
import useSearch from "@/context/Search/useSearch";

export type CampaignSinglePageProps = {
  campaign: CampaignPage;
  keyStages: KeyStagesData;
};

// const h2: PortableTextComponents = {
//   block: {
//     normal: (props) => {
//       return (
//         <OakHeading $font="heading-2" tag="h2">
//           {props.children}
//         </OakHeading>
//       );
//     },
//   },
// };

const CampaignSinglePage: NextPage<CampaignSinglePageProps> = (props) => {
  const { setSearchTerm } = useSearch({});
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
        $ph={["inner-padding-l", "inner-padding-l", "inner-padding-none"]}
      >
        <OakFlex
          $background="bg-decorative5-very-subdued"
          data-testid="campaign-header"
          $width={["100%", "100%", "all-spacing-24"]}
          $pa={["inner-padding-xl2", "inner-padding-xl2", "inner-padding-xl6"]}
          $borderRadius="border-radius-xl"
          $justifyContent={["center", "center", "initial"]}
          $gap="space-between-l"
        >
          <OakFlex $flexDirection="column" $gap="space-between-m2">
            <CMSImage
              $display={["block", "block", "none"]}
              image={props.campaign.header.image}
              format={null}
              $width="none"
              $objectFit="contain"
            />
            <OakHeading tag="h1" $font={["heading-4", "heading-2"]}>
              {props.campaign.header.heading}
            </OakHeading>
            <OakFlex
              $width={["100%", "100%", "max-content"]}
              $flexDirection="column"
              $gap="space-between-m2"
            >
              {/* TODO: restyle keystage keypad btns */}
              <KeyStageKeypad
                title="View subjects by key stage"
                titleTag="h3"
                keyStages={props.keyStages.keyStages}
                trackingOnClick={() => {}}
              />
              <OakBox
                $height={"all-spacing-0"}
                $bt={"border-solid-m"}
                $borderColor={"white"}
               />
              <OakFlex $flexDirection="column" $gap="space-between-s">
                <OakHeading tag="h3" $font="heading-7">
                  Or search by keyword
                </OakHeading>
                {/* TODO: update anlytics search types */}
                <SearchForm
                  searchContext="search"
                  placeholderText="Search by keyword or topic"
                  searchTerm=""
                  handleSubmit={(value) => {
                    setSearchTerm(value);
                  }}
                  analyticsSearchSource={"search page search box"}
                />
              </OakFlex>
            </OakFlex>
          </OakFlex>
          <CMSImage
            $display={["none", "none", "block"]}
            image={props.campaign.header.image}
            format={null}
            $width="none"
            $objectFit="contain"
          />
        </OakFlex>
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
