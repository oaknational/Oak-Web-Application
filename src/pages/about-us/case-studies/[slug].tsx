import { NextPage, GetServerSideProps, GetStaticPropsResult } from "next";
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
import Layout from "@/components/AppComponents/AppLayout";
import { TopNavProps } from "@/components/AppComponents/TopNav/TopNav";
import { OaksImpactCaseStudies } from "@/components/GenericPagesComponents/OaksImpactCaseStudies";
import { resolveOakHref } from "@/common-lib/urls";
import { NewGutterMaxWidth } from "@/components/GenericPagesComponents/NewGutterMaxWidth";
import { useOakNotificationsContext } from "@/context/OakNotifications/useOakNotificationsContext";
import { OaksImpactCaseStudyHeader } from "@/components/GenericPagesComponents/OaksImpactCaseStudyHeader";
import { isFeatureFlagEnabled } from "@/utils/featureFlagServer";
import { OaksImpactCaseStudyContentLayout } from "@/components/GenericPagesComponents/OaksImpactCaseStudyContentLayout";
import VideoPlayer from "@/components/SharedComponents/VideoPlayer";

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
    <Layout
      seoProps={getSeoProps({ title: caseStudy.video.title })}
      $background={"bg-primary"}
      topNavProps={topNav}
    >
      <OakBox $zIndex={"neutral"} $color={"text-primary"}>
        <OakBox
          $gap="spacing-32"
          $bb="border-solid-xxxl"
          $borderColor="border-decorative2"
        >
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
                        { href: "/about-us/oaks-impact", text: "Case studies" },
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
                      isLegacy={true}
                      location="marketing"
                      omitBorder={true}
                    />
                  )
                }
                showTranscript={true}
                transcript={[
                  ...new Array(20).fill(true).map(() => "test transcript text"),
                ]}
                body={"Testing text"}
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
  );
};

// TODO: Add back in once moving back to `getStaticProps(...)`
// export const getStaticPaths = async () => {
//     console.log({shouldSkipInitialBuild})
//   if (shouldSkipInitialBuild) {
//     return getFallbackBlockingConfig();
//   }

//   const impactPageData = await CMSClient.oaksImpactPage();

//   if (!impactPageData) {
//     return {
//       notFound: true,
//     };
//   }

//   const paths = impactPageData.caseStudiesSection.caseStudies.map((caseStudy) => ({
//     params: { slug: caseStudy.slug.current },
//   }));

//   console.log("getStaticPaths: paths", paths);

//   const config: GetStaticPathsResult<URLParams> = {
//     fallback: "blocking",
//     paths,
//   };
//   return config;
// };

type URLParams = {
  slug: string;
};

export const getServerSideProps: GetServerSideProps<
  AboutUsOaksImpactCaseStudyPageProps,
  URLParams
> = async (context) => {
  const isImpactPageEnabled = await isFeatureFlagEnabled(
    context,
    "oaks-impact",
  );
  if (!isImpactPageEnabled) {
    return {
      notFound: true,
    };
  }

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
    oaksImpactCaseStudyPage?.caseStudiesSection.caseStudies.filter(
      (caseStudy) => caseStudy.slug.current !== slug,
    );

  const results: GetStaticPropsResult<AboutUsOaksImpactCaseStudyPageProps> = {
    props: {
      pageData: {
        caseStudy,
        otherCaseStudies,
      },
      topNav,
    },
  };
  return results;
};

export default AboutUsOaksImpactCaseStudy;
