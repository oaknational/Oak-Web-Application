import {
  NextPage,
  GetStaticPathsResult,
  GetStaticProps,
  GetStaticPropsResult,
} from "next";
import {
  OakBreadcrumbs,
  OakBox,
  OakGrid,
  OakGridArea,
  OakVideo,
  OakHandDrawnHR,
} from "@oaknational/oak-components";
import { format } from "date-fns";

import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import { OaksImpactCaseStudyPage } from "@/common-lib/cms-types/aboutPages";
import CMSClient from "@/node-lib/cms";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import getPageProps from "@/node-lib/getPageProps";
import {
  getFallbackBlockingConfig,
  shouldSkipInitialBuild,
} from "@/node-lib/isr";
import Layout from "@/components/AppComponents/AppLayout";
import { TopNavProps } from "@/components/AppComponents/TopNav/TopNav";
import { OaksImpactCaseStudies } from "@/components/GenericPagesComponents/OaksImpactCaseStudies";
import { resolveOakHref } from "@/common-lib/urls";
import { NewGutterMaxWidth } from "@/components/GenericPagesComponents/NewGutterMaxWidth";
import { useOakNotificationsContext } from "@/context/OakNotifications/useOakNotificationsContext";
import { OaksImpactCaseStudyHeader } from "@/components/GenericPagesComponents/OaksImpactCaseStudyHeader";
import { OaksImpactCaseStudyContentLayout } from "@/components/GenericPagesComponents/OaksImpactCaseStudyContentLayout";
import VideoPlayer from "@/components/SharedComponents/VideoPlayer";
import { TeacherBrowseAnalyticsStoreProvider } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";

export type AboutUsOaksImpactCaseStudyPageProps = {
  pageData: {
    caseStudy: OaksImpactCaseStudyPage["caseStudiesSection"]["caseStudies"][number];
    otherCaseStudies: OaksImpactCaseStudyPage["caseStudiesSection"]["caseStudies"];
  };
  topNav: TopNavProps;
};

const AboutUsOaksImpactCaseStudy: NextPage<
  AboutUsOaksImpactCaseStudyPageProps
> = ({ pageData: { caseStudy, otherCaseStudies }, topNav }) => {
  const { setCurrentToastProps } = useOakNotificationsContext();

  const onCopyLink = () => {
    const urlToCopy = window.location.href;
    navigator.clipboard.writeText(urlToCopy);

    setCurrentToastProps({
      message: "Link copied to clipboard.",
      variant: "green",
      autoDismiss: true,
      autoDismissDuration: 4000,
      showIcon: true,
    });
  };

  return (
    <TeacherBrowseAnalyticsStoreProvider
      programmeState={null}
      accessLevel="homepage"
    >
      <Layout
        seoProps={getSeoProps({ title: caseStudy.video.title })}
        $background={"bg-primary"}
        topNavProps={topNav}
      >
        <OakBox $zIndex={"neutral"} $color={"text-primary"}>
          <OakBox $bb="border-solid-xxxl" $borderColor="border-decorative2">
            <NewGutterMaxWidth>
              <OakBox $mt="spacing-40" $mb="spacing-56">
                <OakGrid $cg="spacing-16">
                  <OakGridArea $rowStart={1} $colSpan={12}>
                    <OakBox $pb="spacing-20">
                      <OakBreadcrumbs
                        breadcrumbs={[
                          {
                            href: resolveOakHref({ page: "home" }),
                            text: "Home",
                          },
                          {
                            href: "/about-us/oaks-impact",
                            text: "Oak's impact",
                          },
                          { text: caseStudy.video.title },
                        ]}
                      />
                    </OakBox>
                    <OakHandDrawnHR
                      hrColor={"bg-neutral-stronger"}
                      $height={"spacing-4"}
                    />
                  </OakGridArea>
                  <OakGridArea
                    $rowStart={2}
                    $colStart={[0, 0, 3]}
                    $colSpan={[12, 12, 8]}
                  >
                    <OaksImpactCaseStudyHeader
                      title={caseStudy.video.title}
                      publishedDate={format(
                        new Date(caseStudy.publishedAt),
                        "d MMMM y",
                      )}
                      onCopyLink={onCopyLink}
                    />
                  </OakGridArea>
                </OakGrid>
              </OakBox>
            </NewGutterMaxWidth>
          </OakBox>
          <NewGutterMaxWidth>
            <OaksImpactCaseStudyContentLayout>
              <OakBox $pv="spacing-100" $position={"relative"}>
                <OakVideo
                  videoSlot={
                    caseStudy.video.video.asset && (
                      <VideoPlayer
                        playbackPolicy="public"
                        thumbnailTime={caseStudy.video.video.asset.thumbTime}
                        playbackId={caseStudy.video.video.asset.playbackId}
                        title={caseStudy.video.title}
                        location="marketing"
                        omitBorder={true}
                      />
                    )
                  }
                  showTranscript={true}
                  transcript={caseStudy.video.transcript}
                  body={caseStudy.textRaw ?? undefined}
                />
              </OakBox>
            </OaksImpactCaseStudyContentLayout>
          </NewGutterMaxWidth>

          <OaksImpactCaseStudies
            title="Explore more case studies"
            caseStudies={otherCaseStudies}
          />
        </OakBox>
      </Layout>
    </TeacherBrowseAnalyticsStoreProvider>
  );
};

type URLParams = {
  slug: string;
};

export const getStaticPaths = async () => {
  if (shouldSkipInitialBuild) {
    return getFallbackBlockingConfig();
  }

  const impactPageData = await CMSClient.oaksImpactPage();

  if (!impactPageData) {
    return {
      notFound: true,
    };
  }

  const paths = impactPageData.caseStudiesSection.caseStudies.map(
    (caseStudy) => ({
      params: { slug: caseStudy.slug.current },
    }),
  );

  const config: GetStaticPathsResult<URLParams> = {
    fallback: "blocking",
    paths,
  };
  return config;
};

export const getStaticProps: GetStaticProps<
  AboutUsOaksImpactCaseStudyPageProps,
  URLParams
> = async (context) => {
  return getPageProps({
    page: "about-oaks-impact-case-study::getStaticProps",
    context,
    getProps: async () => {
      const slug = context.params?.slug;
      if (!slug) {
        return { notFound: true };
      }

      const isPreviewMode = context.preview === true;
      const oaksImpactCaseStudyPage = await CMSClient.oaksImpactCaseStudyPage({
        previewMode: isPreviewMode,
      });

      const caseStudy =
        oaksImpactCaseStudyPage?.caseStudiesSection.caseStudies.find(
          (caseStudy) => caseStudy.slug.current === slug,
        );

      const topNav = await curriculumApi2023.topNav();

      if (!oaksImpactCaseStudyPage || !caseStudy) {
        return {
          notFound: true,
        };
      }

      const otherCaseStudies =
        oaksImpactCaseStudyPage.caseStudiesSection.caseStudies.filter(
          (caseStudy) => caseStudy.slug.current !== slug,
        );

      const results: GetStaticPropsResult<AboutUsOaksImpactCaseStudyPageProps> =
        {
          props: {
            pageData: {
              caseStudy,
              otherCaseStudies,
            },
            topNav,
          },
        };
      return results;
    },
  });
};

export default AboutUsOaksImpactCaseStudy;
