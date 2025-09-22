import {
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
  NextPage,
} from "next";
import { OakFlex, OakHeading, OakP } from "@oaknational/oak-components";
import { PortableTextComponents } from "@portabletext/react";

import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import {
  CampaignContentType,
  CampaignPage,
} from "@/common-lib/cms-types/campaignPage";
import CMSClient from "@/node-lib/cms";
import AppLayout from "@/components/SharedComponents/AppLayout";
import getPageProps from "@/node-lib/getPageProps";
import curriculumApi2023, {
  KeyStagesData,
} from "@/node-lib/curriculum-api-2023";
import { CampaignPageHeader } from "@/components/GenericPagesComponents/CampaignPageHeader/CampaignPageHeader";
import { CampaignPageIntro } from "@/components/GenericPagesComponents/CampaignPageIntro/CampaignPageIntro";
import { CampaignPromoBanner } from "@/components/GenericPagesComponents/CampaignPromoBanner/CampaignPromoBanner";
import { CampaignVideoBanner } from "@/components/GenericPagesComponents/CampaignVideoBanner/CampaignVideoBanner";
import CampaignNewsletterSignup from "@/components/GenericPagesComponents/CampaignNewsletterSignup/CampaignNewsletterSignup";
import {
  shouldSkipInitialBuild,
  getFallbackBlockingConfig,
} from "@/node-lib/isr";

export const blockOrder = [
  "CampaignIntro",
  "CampaignVideoBanner",
  "NewsletterSignUp",
  "CampaignPromoBanner",
];

export function sortCampaignBlocksByBlockType(
  sortOrder: string[],
  campaignBlocks: CampaignPage["content"],
): CampaignContentType[] {
  return sortOrder
    .map((blockType) => {
      return campaignBlocks.filter(({ type }) => type === blockType);
    })
    .flat();
}

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
    heading4: (props) => {
      return (
        <OakHeading
          $font={["heading-6", "heading-5", "heading-4"]}
          tag="h4"
          $mb={"space-between-m"}
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
  const sortedContent = sortCampaignBlocksByBlockType(
    blockOrder,
    props.campaign.content,
  );
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
        {sortedContent.map((section: CampaignContentType) => {
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
          if (section.type === "NewsletterSignUp") {
            return (
              <CampaignNewsletterSignup
                textStyles={campaignTextStyles}
                {...section}
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
          if (section.type === "CampaignVideoBanner") {
            if (section.video) {
              return (
                <CampaignVideoBanner
                  key={section.type}
                  textStyles={campaignTextStyles}
                  heading={section.headingPortableTextWithPromo}
                  subheading={section.subheadingPortableTextWithPromo}
                  video={section.video}
                />
              );
            }
          }
        })}
      </OakFlex>
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

      const keyStages = await curriculumApi2023.keyStages();

      if (!campaignPageResult || !keyStages) {
        return {
          notFound: true,
        };
      }

      const results: GetStaticPropsResult<CampaignSinglePageProps> = {
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
