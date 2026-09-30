import { NextPage, GetStaticPropsResult, GetServerSideProps } from "next";
import {
  OakBreadcrumbs,
  OakBox,
  OakGrid,
  OakGridArea,
  OakVideo,
  OakHandDrawnHR,
  OakTagFunctional,
  OakHeading,
  OakAnchorTarget,
  OakFlex,
} from "@oaknational/oak-components";
import { format } from "date-fns";

import { getSeoProps } from "@/browser-lib/seo/getSeoProps";
import { OaksImpactCaseStudyPage } from "@/common-lib/cms-types/aboutPages";
import CMSClient from "@/node-lib/cms";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import Layout from "@/components/AppComponents/AppLayout";
import { TopNavProps } from "@/components/AppComponents/TopNav/TopNav";
import { CaseStudiesSection } from "@/components/GenericPagesComponents/CaseStudiesSection";
import { resolveOakHref } from "@/common-lib/urls";
import { NewGutterMaxWidth } from "@/components/GenericPagesComponents/NewGutterMaxWidth";
import { useOakNotificationsContext } from "@/context/OakNotifications/useOakNotificationsContext";
import { CaseStudyHeader } from "@/components/GenericPagesComponents/CaseStudyHeader";
import { OaksImpactCaseStudyContentLayout } from "@/components/GenericPagesComponents/OaksImpactCaseStudyContentLayout";
import VideoPlayer from "@/components/SharedComponents/VideoPlayer";
import { TeacherBrowseAnalyticsStoreProvider } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";
import { PortableTextWithDefaults } from "@/components/SharedComponents/PortableText/PortableText";
import { isFeatureFlagEnabledServer } from "@/utils/featureFlagChecks/server";

// to do - this data retrieval will be decoupled from oak's impact in coming tickets
export type AboutUsOaksImpactCaseStudyPageProps = {
  pageData: {
    caseStudy: OaksImpactCaseStudyPage["caseStudiesSection"]["caseStudies"][number];
    otherCaseStudies: OaksImpactCaseStudyPage["caseStudiesSection"]["caseStudies"];
    isV2Enabled: boolean;
  };
  topNav: TopNavProps;
};

const AboutUsOaksImpactCaseStudy: NextPage<
  AboutUsOaksImpactCaseStudyPageProps
> = ({ pageData: { caseStudy, otherCaseStudies, isV2Enabled }, topNav }) => {
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
      showClose: true,
    });
  };

  const title = caseStudy.title ?? caseStudy.video?.title ?? "";

  return (
    <TeacherBrowseAnalyticsStoreProvider
      programmeState={null}
      accessLevel="homepage"
    >
      <Layout
        seoProps={getSeoProps({ title })}
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
                          { text: title },
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
                    <CaseStudyHeader
                      title={title}
                      publishedDate={format(
                        new Date(caseStudy.publishedAt),
                        "d MMMM y",
                      )}
                      onCopyLink={onCopyLink}
                      summary={isV2Enabled ? caseStudy.summaryRaw : undefined}
                      tag={isV2Enabled ? caseStudy.tag : undefined}
                    />
                  </OakGridArea>
                </OakGrid>
              </OakBox>
            </NewGutterMaxWidth>
          </OakBox>
          <NewGutterMaxWidth>
            <OaksImpactCaseStudyContentLayout>
              {caseStudy.video && (
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
              )}

              {isV2Enabled && (
                <>
                  {caseStudy.content && (
                    <OakBox $pv="spacing-100" $position={"relative"}>
                      {caseStudy.content.map((contentBlock, index) => (
                        <OakFlex
                          key={index}
                          $flexDirection="column"
                          $alignItems="flex-start"
                        >
                          {contentBlock.label && (
                            <OakTagFunctional
                              label={contentBlock.label}
                              $background="bg-decorative2-main"
                            />
                          )}
                          <OakAnchorTarget
                            id={`#${contentBlock.anchorSlug?.current}`}
                          />
                          <OakHeading tag="h2">
                            {contentBlock.heading}
                          </OakHeading>
                          <PortableTextWithDefaults
                            value={contentBlock.contentRaw ?? undefined}
                          />
                        </OakFlex>
                      ))}
                    </OakBox>
                  )}

                  {caseStudy.showGetInTouchPanel &&
                    caseStudy.getInTouchPanel && (
                      <OakBox $pv="spacing-100" $position={"relative"}>
                        {JSON.stringify(caseStudy.getInTouchPanel)}
                        {/* TODO: Add in <CaseStudyGetInTouch/> */}
                      </OakBox>
                    )}
                </>
              )}
            </OaksImpactCaseStudyContentLayout>
          </NewGutterMaxWidth>

          <CaseStudiesSection
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

export const getServerSideProps: GetServerSideProps<
  AboutUsOaksImpactCaseStudyPageProps,
  URLParams
> = async (context) => {
  const isV2Enabled = await isFeatureFlagEnabledServer(
    context.req.cookies,
    "case-studies-v2",
  );

  const slug = context.params?.slug;
  if (!slug) {
    return { notFound: true };
  }

  const isPreviewMode = context.preview === true;
  const caseStudy = await CMSClient.caseStudyPage({
    slug,
    previewMode: isPreviewMode,
  });

  const topNav = await curriculumApi2023.topNav();

  if (!caseStudy) {
    return {
      notFound: true,
    };
  }

  const otherCaseStudies = await CMSClient.caseStudyLibraryPage({ limit: 3 });

  const results: GetStaticPropsResult<AboutUsOaksImpactCaseStudyPageProps> = {
    props: {
      pageData: {
        caseStudy,
        otherCaseStudies,
        isV2Enabled,
      },
      topNav,
    },
  };
  return results;
};

export default AboutUsOaksImpactCaseStudy;
