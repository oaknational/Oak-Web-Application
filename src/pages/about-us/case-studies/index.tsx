import { NextPage, GetServerSideProps } from "next";

import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import Layout from "@/components/AppComponents/AppLayout";
import { TopNavProps } from "@/components/AppComponents/TopNav/TopNav";
import { TeacherBrowseAnalyticsStoreProvider } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";
import { isFeatureFlagEnabledServer } from "@/utils/featureFlagChecks/server";
import { OakBox, OakCard, OakFlex } from "@/styles/oakThemeApp";
import { NewGutterMaxWidth } from "@/components/GenericPagesComponents/NewGutterMaxWidth";
import CMSClient from "@/node-lib/cms";
import { OaksImpactCaseStudyListPage } from "@/common-lib/cms-types/aboutPages";
import getProxiedSanityAssetUrl from "@/common-lib/urls/getProxiedSanityAssetUrl";
import { resolveOakHref } from "@/common-lib/urls";

export type AboutUsOaksImpactCaseStudyListPageProps = {
  pageData: {
    caseStudies: OaksImpactCaseStudyListPage;
  };
  topNav: TopNavProps;
};

export const AboutUsOaksImpactCaseStudyList: NextPage<
  AboutUsOaksImpactCaseStudyListPageProps
> = ({ pageData: { caseStudies }, topNav }) => {
  const items = caseStudies.map((caseStudy) => ({
    heading: caseStudy.video.title,
    href: resolveOakHref({
      page: "about-case-study",
      slug: caseStudy.slug.current,
    }),
    imageSrc: getProxiedSanityAssetUrl(caseStudy.image?.asset?.url) ?? "",
  }));

  return (
    <TeacherBrowseAnalyticsStoreProvider
      programmeState={null}
      accessLevel="homepage"
    >
      <Layout
        seoProps={getSeoProps({ title: "Case Studies" })}
        $background={"bg-primary"}
        topNavProps={topNav}
      >
        <OakBox $zIndex={"neutral"} $color={"text-primary"}>
          <NewGutterMaxWidth>
            <OakFlex
              $pv={["spacing-56", "spacing-80", "spacing-80"]}
              $alignItems="flex-start"
            >
              <OakFlex
                $maxWidth="spacing-960"
                $gap="spacing-16"
                $flexDirection="column"
                $pa={["spacing-16", "spacing-20", "spacing-20"]}
                $borderRadius="border-radius-l"
                $background="bg-decorative2-very-subdued"
              >
                {items.map((item) => {
                  return (
                    <OakCard
                      key={item.href}
                      aspectRatio="4/3"
                      cardOrientation={["column", "row", "row"]}
                      {...item}
                    />
                  );
                })}
              </OakFlex>
            </OakFlex>
          </NewGutterMaxWidth>
        </OakBox>
      </Layout>
    </TeacherBrowseAnalyticsStoreProvider>
  );
};

export const getServerSideProps: GetServerSideProps<
  AboutUsOaksImpactCaseStudyListPageProps
> = async (context) => {
  const isEnabled = await isFeatureFlagEnabledServer(
    context.req.cookies,
    "case-studies-v2",
  );
  if (!isEnabled) {
    return { notFound: true };
  }

  const isPreviewMode = context.preview === true;
  const oaksImpactCaseStudyPage = await CMSClient.oaksImpactCaseStudyListPage({
    previewMode: isPreviewMode,
  });

  const topNav = await curriculumApi2023.topNav();

  if (!oaksImpactCaseStudyPage) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      pageData: {
        caseStudies: oaksImpactCaseStudyPage,
      },
      topNav,
    },
  };
};

export default AboutUsOaksImpactCaseStudyList;
