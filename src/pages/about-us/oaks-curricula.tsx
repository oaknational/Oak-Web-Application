import { GetServerSideProps, NextPage } from "next";
import {
  OakAllSpacingToken,
  OakBox,
  OakFlex,
  OakHeading,
  OakIconName,
} from "@oaknational/oak-components";
import styled from "styled-components";

import Layout from "@/components/AppComponents/Layout";
import { AboutUsLayout } from "@/components/GenericPagesComponents/AboutUsLayout";
import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import {
  AboutSharedHeader,
  AboutSharedHeaderImage,
} from "@/components/GenericPagesComponents/AboutSharedHeader";
import { NewGutterMaxWidth } from "@/components/GenericPagesComponents/NewGutterMaxWidth";
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

const UnstyledLi = styled.li`
  display: flex;
  flex: 1 1 0;
  list-style: none;
`;

const curriculaCardsInfo: Array<{
  iconName: OakIconName;
  iconWidth: OakAllSpacingToken;
  text: string;
}> = [
  {
    iconName: "clipboard",
    iconWidth: "spacing-48",
    text: "National curriculum and exam board aligned",
  },
  {
    iconName: "free-tag",
    iconWidth: "spacing-80",
    text: "Free and always will be",
  },
  {
    iconName: "book-steps",
    iconWidth: "spacing-72",
    text: "Covers key stages 1-4 across 20 subjects",
  },
  {
    iconName: "threads",
    iconWidth: "spacing-64",
    text: "Fully sequenced and ready to adapt",
  },
];

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

  const guidingPrinciplesImageUrl =
    getProxiedSanityAssetUrl(pageData.guidingPrinciples.image?.asset?.url) ??
    undefined;
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
          <NewGutterMaxWidth>
            <OakFlex
              $flexDirection={"column"}
              $gap={"spacing-56"}
              $pv={["spacing-56", "spacing-80"]}
            >
              <OakFlex
                as="ul"
                $flexDirection={["column", "row"]}
                $pa={"spacing-0"}
                $ma={"spacing-0"}
                $gap={"spacing-16"}
                $alignItems="stretch"
              >
                {curriculaCardsInfo.map((cardInfo) => (
                  <UnstyledLi key={cardInfo.iconName}>
                    <CurricInfoCard
                      iconName={cardInfo.iconName}
                      background="bg-primary"
                      iconHeight={"spacing-92"}
                      iconWidth={cardInfo.iconWidth}
                      borderColor="border-decorative4"
                    >
                      {cardInfo.text}
                    </CurricInfoCard>
                  </UnstyledLi>
                ))}
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
                  See Oak's curricula in practice
                </OakHeading>
                <SubjectPhasePicker {...curriculumPhaseOptions} />
              </OakFlex>
            </OakFlex>
          </NewGutterMaxWidth>
        </OakBox>
        {(currentPartnerItems.length > 0 || legacyPartnerItems.length > 0) && (
          <NewGutterMaxWidth>
            <OakFlex
              $flexDirection={"column"}
              $pv={"spacing-80"}
              $gap={"spacing-56"}
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
          </NewGutterMaxWidth>
        )}
        {/* @debt: Can oak support you section */}
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
