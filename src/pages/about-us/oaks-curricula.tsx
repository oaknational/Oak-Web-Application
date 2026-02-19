import { GetServerSideProps, NextPage } from "next";
import {
  OakBox,
  OakFlex,
  OakHeading,
  OakMaxWidth,
} from "@oaknational/oak-components";

import Layout from "@/components/AppComponents/Layout";
import { AboutUsLayout } from "@/components/GenericPagesComponents/AboutUsLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import {
  AboutSharedHeader,
  AboutSharedHeaderImage,
} from "@/components/GenericPagesComponents/AboutSharedHeader";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import { TopNavProps } from "@/components/AppComponents/TopNav/TopNav";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import SubjectPhasePicker from "@/components/SharedComponents/SubjectPhasePicker";
import { SubjectPhasePickerData } from "@/components/SharedComponents/SubjectPhasePicker/SubjectPhasePicker";
import { filterValidCurriculumPhaseOptions } from "@/pages-helpers/curriculum/docx/tab-helpers";
import { CurriculumPartners } from "@/components/GenericPagesComponents/CurriculumPartners";
import { GuidingPrinciples } from "@/components/GenericPagesComponents/GuidingPrinciples";
import CurricInfoCard from "@/components/CurriculumComponents/CurricInfoCard";
import isNewAboutUsPagesEnabled from "@/utils/isNewAboutUsPagesEnabled";
import CMSClient from "@/node-lib/cms";
import { OaksCurriculaPage as OaksCurriculaPageData } from "@/common-lib/cms-types/aboutPages";
import getProxiedSanityAssetUrl from "@/common-lib/urls/getProxiedSanityAssetUrl";
import { trimTrailingEmptyBlocks } from "@/utils/portableText/trimEmptyBlocks";

const posthogApiKey = getBrowserConfig("posthogApiKey");

export type OaksCurriculaPageProps = {
  pageData: OaksCurriculaPageData;
  curriculumPhaseOptions: SubjectPhasePickerData;
  topNav: TopNavProps;
};

export const OaksCurricula: NextPage<OaksCurriculaPageProps> = ({
  pageData,
  curriculumPhaseOptions,
  topNav,
}) => {
  const trimmedSubtitle = trimTrailingEmptyBlocks(
    pageData.header.subtitlePortableText,
  );

  const headerImageUrl = getProxiedSanityAssetUrl(
    pageData.header.image?.asset?.url,
  );
  const headerImageAlt = pageData.header.image?.altText ?? "";

  const guidingPrinciplesImageUrl = getProxiedSanityAssetUrl(
    pageData.guidingPrinciples.image?.asset?.url,
  );
  const guidingPrinciplesImageAlt =
    pageData.guidingPrinciples.image?.altText ?? "";

  const currentPartnerItems = (pageData.currentPartners.partners ?? []).map(
    (partner) => ({
      imageUrl: getProxiedSanityAssetUrl(partner.logo?.asset?.url) ?? "",
      alt: partner.logo?.altText ?? "",
    }),
  );

  const legacyPartnerItems = (pageData.legacyPartners.partners ?? []).map(
    (partner) => ({
      imageUrl: getProxiedSanityAssetUrl(partner.logo?.asset?.url) ?? "",
      alt: partner.logo?.altText ?? "",
    }),
  );

  return (
    <Layout
      seoProps={getSeoProps(pageData.seo ?? { title: "Oak's Curricula" })}
      $background={"bg-primary"}
      topNavProps={topNav}
    >
      <AboutUsLayout>
        <AboutSharedHeader
          title={"Oak's curricula"}
          content={trimmedSubtitle ?? pageData.header.subtitlePortableText}
          titleHighlight="bg-decorative4-main"
        >
          {headerImageUrl && (
            <AboutSharedHeaderImage
              imageAlt={headerImageAlt}
              imageUrl={headerImageUrl}
            />
          )}
        </AboutSharedHeader>
        <OakBox $background={"bg-decorative4-very-subdued"}>
          <OakMaxWidth $pv={"spacing-80"} $ph={["spacing-16"]}>
            <OakFlex $flexDirection={"column"} $gap={"spacing-56"}>
              <OakFlex
                $flexDirection={["column", "row"]}
                $flexWrap="wrap"
                $gap="spacing-16"
                $alignItems="stretch"
              >
                <CurricInfoCard
                  iconName="clipboard"
                  background="bg-primary"
                  iconHeight={"spacing-92"}
                  iconWidth={"spacing-48"}
                  borderColor="border-decorative4"
                >
                  National curriculum and exam board aligned
                </CurricInfoCard>
                <CurricInfoCard
                  iconName="free-tag"
                  background="bg-primary"
                  iconHeight="spacing-92"
                  iconWidth="spacing-80"
                  borderColor="border-decorative4"
                >
                  Free and always will be
                </CurricInfoCard>
                <CurricInfoCard
                  iconName="book-steps"
                  background="bg-primary"
                  iconHeight="spacing-92"
                  iconWidth="spacing-72"
                  borderColor="border-decorative4"
                >
                  Covers key stages 1-4 across 20 subjects
                </CurricInfoCard>
                <CurricInfoCard
                  iconName="threads"
                  background="bg-primary"
                  iconHeight="spacing-92"
                  iconWidth="spacing-64"
                  borderColor="border-decorative4"
                >
                  Fully sequenced and ready to adapt
                </CurricInfoCard>
              </OakFlex>
              <GuidingPrinciples
                $background="bg-primary"
                accentColor="border-decorative4"
                imageUrl={guidingPrinciplesImageUrl}
                imageAlt={guidingPrinciplesImageAlt}
                principles={pageData.guidingPrinciples.principles}
              />
              <OakFlex
                $flexDirection="column"
                $maxWidth={"spacing-640"}
                $gap={["spacing-8", "spacing-12", "spacing-12"]}
              >
                <OakHeading
                  tag="h2"
                  $font={["heading-5", "heading-4", "heading-4"]}
                >
                  See Oak&apos;s curriculum in practice
                </OakHeading>
                <SubjectPhasePicker {...curriculumPhaseOptions} />
              </OakFlex>
            </OakFlex>
          </OakMaxWidth>
        </OakBox>
        {(currentPartnerItems.length > 0 || legacyPartnerItems.length > 0) && (
          <OakMaxWidth>
            <OakFlex
              $gap={"spacing-56"}
              $pt={"spacing-80"}
              $flexDirection={"column"}
            >
              <OakHeading
                tag="h2"
                $font={["heading-4", "heading-3", "heading-3"]}
              >
                Curriculum partners
              </OakHeading>
              {currentPartnerItems.length > 0 && (
                <CurriculumPartners
                  title="Current"
                  text="Partners involved in the creation of our new curricula (published after September 2022)."
                  items={currentPartnerItems}
                />
              )}
              {legacyPartnerItems.length > 0 && (
                <CurriculumPartners
                  title="Legacy"
                  text="Partners involved in the creation of our previous curricula (published before September 2022)."
                  items={legacyPartnerItems}
                />
              )}
            </OakFlex>
          </OakMaxWidth>
        )}
        {/* TODO: Can oak support you */}
      </AboutUsLayout>
    </Layout>
  );
};

const fetchSubjectPhasePickerData: () => Promise<SubjectPhasePickerData> =
  async () => {
    const subjects = await curriculumApi2023.curriculumPhaseOptions();
    return {
      subjects: filterValidCurriculumPhaseOptions(subjects),
      tab: "units",
    };
  };

export const getServerSideProps = (async (context) => {
  const isPreviewMode = context.preview === true;

  const enableV2 = await isNewAboutUsPagesEnabled(
    posthogApiKey,
    context.req.cookies,
  );

  if (!enableV2) {
    return {
      notFound: true,
    };
  }

  const pageData = await CMSClient.oaksCurriculaPage({
    previewMode: isPreviewMode,
  });

  if (!pageData) {
    return {
      notFound: true,
    };
  }

  const [curriculumPhaseOptions, topNav] = await Promise.all([
    fetchSubjectPhasePickerData(),
    curriculumApi2023.topNav(),
  ]);

  return {
    props: {
      pageData,
      curriculumPhaseOptions,
      topNav,
    },
  };
}) satisfies GetServerSideProps<OaksCurriculaPageProps>;

export default OaksCurricula;
